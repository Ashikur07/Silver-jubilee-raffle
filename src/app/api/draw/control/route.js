import dbConnect from "@/lib/db";
import DrawState from "@/models/DrawState";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { action, prize } = await req.json(); 

  let state = await DrawState.findOne();
  if (!state) state = await DrawState.create({});

  if (action === "start") {
    // ১. র‍্যান্ডম উইনার এখনই সিলেক্ট করে ফেলব
    const winnerTicket = await Ticket.aggregate([
      { $match: { status: "sold" } }, // শুধুমাত্র বিক্রি হওয়া টিকেট থেকে
      { $sample: { size: 1 } }
    ]);

    if (winnerTicket.length === 0) {
      return NextResponse.json({ message: "No sold tickets found!" }, { status: 400 });
    }

    // ২. স্টেট আপডেট (নতুন ড্র শুরু)
    // আমরা একটা 'timestamp' দিচ্ছি যাতে ফ্রন্টএন্ড বোঝে নতুন ড্র শুরু হয়েছে
    state.isSpinning = true; 
    state.currentPrize = prize;
    state.lastWinner = winnerTicket[0].ticketNumber; 
    state.drawStartTime = new Date(); // ট্রিগার হিসেবে কাজ করবে
    
    // হিস্ট্রি সেভ
    state.winnersHistory.push({
      prize: prize,
      ticketNumber: winnerTicket[0].ticketNumber,
      ownerEmail: winnerTicket[0].ownerEmail
    });

    await state.save();
    return NextResponse.json({ success: true, winner: winnerTicket[0].ticketNumber });
  } 
  
  // রিসেট বা অন্য অপশনের জন্য
  if (action === "reset") {
      state.isSpinning = false;
      state.lastWinner = null;
      await state.save();
      return NextResponse.json({ message: "Reset" });
  }
}