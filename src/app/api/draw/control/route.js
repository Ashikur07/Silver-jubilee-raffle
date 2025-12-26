import dbConnect from "@/lib/db";
import DrawState from "@/models/DrawState";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { action, totalCount } = await req.json(); 

  let state = await DrawState.findOne();
  if (!state) state = await DrawState.create({});

  // --- ১. সেটআপ ফেজ (Admin ১০টা প্রাইজ সেট করল) ---
  if (action === "setup") {
     state.totalPrizes = totalCount;
     state.currentPrizeRank = totalCount; // ১০ থেকে শুরু হবে
     state.status = "READY"; // ফ্রন্টএন্ডে এলার্ট দেখাবে
     state.isSpinning = false;
     state.lastWinner = null;
     state.currentPrizeLabel = "";
     
     await state.save();
     return NextResponse.json({ success: true, message: "Setup Complete" });
  }

  // --- ২. ড্র স্টার্ট করা (Auto Logic) ---
  if (action === "start") {
    if (state.currentPrizeRank <= 0) {
        return NextResponse.json({ success: false, message: "All draws finished!" });
    }

    // অটোমেটিক প্রাইজ নাম জেনারেট (যেমন: 10th Prize, 1st Prize)
    const rank = state.currentPrizeRank;
    const prizeLabel = rank === 1 ? "Grand Prize (1st)" : `${rank}th Prize`;

    // র‍্যান্ডম উইনার সিলেক্ট
    const winnerTicket = await Ticket.aggregate([
      { $match: { status: "sold" } }, 
      { $sample: { size: 1 } }
    ]);

    if (winnerTicket.length === 0) {
      return NextResponse.json({ success: false, message: "No sold tickets found!" });
    }

    // স্টেট আপডেট
    state.isSpinning = true;
    state.currentPrizeLabel = prizeLabel;
    state.lastWinner = winnerTicket[0].ticketNumber;
    state.drawStartTime = new Date();
    
    // র‍্যাংক কমানো (পরের বারের জন্য)
    // নোট: আমরা এখনই র‍্যাংক কমাচ্ছি, যাতে বাটন আপডেট হয়ে যায় পরের ড্রয়ের জন্য
    state.currentPrizeRank = state.currentPrizeRank - 1;
    if (state.currentPrizeRank === 0) state.status = "FINISHED";

    await state.save();
    return NextResponse.json({ success: true, winner: winnerTicket[0].ticketNumber, nextRank: state.currentPrizeRank });
  }

  // --- ৩. রিসেট ---
  if (action === "reset") {
      state.status = "IDLE";
      state.totalPrizes = 0;
      state.currentPrizeRank = 0;
      state.isSpinning = false;
      state.lastWinner = null;
      await state.save();
      return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}

// GET মেথড (Admin প্যানেল লোড হলে বর্তমান অবস্থা জানার জন্য)
export async function GET() {
    await dbConnect();
    let state = await DrawState.findOne();
    return NextResponse.json(state || { status: "IDLE" });
}