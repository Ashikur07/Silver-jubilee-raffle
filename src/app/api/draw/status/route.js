import dbConnect from "@/lib/db";
import DrawState from "@/models/DrawState";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const state = await DrawState.findOne();
  
  if (!state) {
    return NextResponse.json({
      isSpinning: false,
      lastWinner: null,
      currentPrize: "",
      isSetupMode: false,
      totalPrizes: 0,
      currentPrizeNumber: 0,
      winnersHistory: []
    });
  }
  
  return NextResponse.json({
    isSpinning: state.isSpinning,
    lastWinner: state.lastWinner,
    currentPrize: state.currentPrize,
    isSetupMode: state.isSetupMode,
    totalPrizes: state.totalPrizes,
    currentPrizeNumber: state.currentPrizeNumber,
    winnersHistory: state.winnersHistory
  });
}