import dbConnect from "@/lib/db";
import DrawState from "@/models/DrawState";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const { action, prize } = await req.json(); // action: 'start' or 'stop'

  let state = await DrawState.findOne();
  if (!state) state = await DrawState.create({});

  if (action === "start") {
    state.isSpinning = true;
    state.currentPrize = prize;
    state.lastWinner = null;
    await state.save();
    return NextResponse.json({ message: "Started" });
  } 
  
  if (action === "stop") {
    // র‍্যান্ডম উইনার সিলেক্ট
    const winnerTicket = await Ticket.aggregate([
      { $match: { status: "sold" } },
      { $sample: { size: 1 } }
    ]);

    if (winnerTicket.length > 0) {
      state.isSpinning = false;
      state.lastWinner = winnerTicket[0].ticketNumber;
      state.winnersHistory.push({
        prize: state.currentPrize,
        ticketNumber: winnerTicket[0].ticketNumber,
        ownerEmail: winnerTicket[0].ownerEmail
      });
      await state.save();
      return NextResponse.json({ winner: winnerTicket[0].ticketNumber });
    }
  }
}