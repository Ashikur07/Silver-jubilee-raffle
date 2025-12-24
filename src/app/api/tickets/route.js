import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

// টিকেট লিস্ট পাওয়ার জন্য
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const type = searchParams.get("type") || "online";
  const limit = 100; // প্রতি পেজে ১০০ টিকেট

  const tickets = await Ticket.find({ type })
    .sort({ ticketNumber: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Ticket.countDocuments({ type });
  const sold = await Ticket.countDocuments({ type, status: "sold" });

  return NextResponse.json({ tickets, total, sold });
}

// টিকেট কেনার জন্য
export async function POST(req) {
  await dbConnect();
  const { ticketIds, email } = await req.json();

  await Ticket.updateMany(
    { _id: { $in: ticketIds }, status: "available" },
    { $set: { status: "sold", ownerEmail: email, soldAt: new Date() } }
  );

  return NextResponse.json({ success: true });
}