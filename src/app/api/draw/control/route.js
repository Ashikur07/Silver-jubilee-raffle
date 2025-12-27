import dbConnect from "@/lib/db";
import DrawState from "@/models/DrawState";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { action, totalPrizes } = await req.json();

  let state = await DrawState.findOne();
  if (!state) state = await DrawState.create({});

  // === SET MODE: Admin সেট করছে কয়টা প্রাইজ ===
  if (action === "set") {
    state.isSetupMode = true;
    state.totalPrizes = totalPrizes;
    state.currentPrizeNumber = totalPrizes; // উল্টা দিক থেকে শুরু (10, 9, 8...)
    state.isSpinning = false;
    state.lastWinner = null;
    state.currentPrize = `${totalPrizes}th Prize`;
    await state.save();
    return NextResponse.json({ 
      message: "Setup mode activated",
      state: {
        totalPrizes,
        currentPrizeNumber: totalPrizes,
        currentPrize: `${totalPrizes}th Prize`
      }
    });
  }

  // === START MODE: Admin এক্সিকিউট করছে কারেন্ট প্রাইজের ড্র ===
  if (action === "start") {
    if (!state.isSetupMode || state.totalPrizes === 0) {
      return NextResponse.json({ error: "Setup not done yet!" }, { status: 400 });
    }

    // র‍্যান্ডম উইনার সিলেক্ট
    const winnerTicket = await Ticket.aggregate([
      { $match: { status: "sold" } },
      { $sample: { size: 1 } }
    ]);

    if (winnerTicket.length > 0) {
      state.isSpinning = true;
      state.lastWinner = winnerTicket[0].ticketNumber;
      
      // History তে save করো
      state.winnersHistory.push({
        prize: state.currentPrize,
        prizeNumber: state.currentPrizeNumber,
        ticketNumber: winnerTicket[0].ticketNumber,
        ownerEmail: winnerTicket[0].ownerEmail
      });

      // পরবর্তী প্রাইজ setup করো
      state.currentPrizeNumber -= 1;
      if (state.currentPrizeNumber > 0) {
        state.currentPrize = `${state.currentPrizeNumber}th Prize`;
      }

      await state.save();
      
      return NextResponse.json({ 
        winner: winnerTicket[0].ticketNumber,
        email: winnerTicket[0].ownerEmail,
        currentPrize: state.currentPrize,
        isDrawComplete: state.currentPrizeNumber === 0
      });
    } else {
      return NextResponse.json({ error: "No tickets available" }, { status: 400 });
    }
  }

  // === RESET MODE: নতুন ড্র সেশন শুরু করার জন্য ===
  if (action === "reset") {
    state.isSetupMode = false;
    state.totalPrizes = 0;
    state.currentPrizeNumber = 0;
    state.isSpinning = false;
    state.lastWinner = null;
    state.currentPrize = "";
    state.winnersHistory = [];
    await state.save();
    return NextResponse.json({ message: "Reset complete" });
  }
}