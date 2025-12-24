import dbConnect from "@/lib/db";
import DrawState from "@/models/DrawState";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const state = await DrawState.findOne();
  return NextResponse.json(state || {});
}