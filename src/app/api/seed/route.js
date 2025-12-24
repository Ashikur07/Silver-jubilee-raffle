import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  
  // চেক করি আগে ডাটা আছে কি না
  const count = await Ticket.countDocuments();
  if (count > 0) return NextResponse.json({ message: "Already seeded" });

  const tickets = [];
  
  // ১০০০-৫০০০ (অফলাইন)
  for (let i = 1000; i <= 5000; i++) {
    tickets.push({ ticketNumber: i, type: "offline", status: "available" });
  }
  
  // ৫০০১-১০০০০ (অনলাইন)
  for (let i = 5001; i <= 10000; i++) {
    tickets.push({ ticketNumber: i, type: "online", status: "available" });
  }

  await Ticket.insertMany(tickets);
  return NextResponse.json({ message: "Tickets generated successfully!" });
}