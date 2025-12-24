import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function GET() { // ড্র করার জন্য GET রিকোয়েস্ট
  await dbConnect();
  
  // এগ্রিগেশন ব্যবহার করে র‍্যান্ডম স্যাম্পল বের করা
  const winner = await Ticket.aggregate([
    { $match: { status: "sold" } }, // শুধু বিক্রি হওয়া টিকেট
    { $sample: { size: 1 } } // যেকোনো ১টা তোলো
  ]);

  if (winner.length === 0) {
    return NextResponse.json({ message: "No tickets sold yet!" });
  }

  return NextResponse.json(winner[0]);
}