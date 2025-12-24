import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // ১. ডাটাবেসে চেক করি লাস্ট অনলাইন টিকেট কত বিক্রি হয়েছে
    // আমরা ৫০০১ এর পর থেকে খুঁজব
    const lastOnlineTicket = await Ticket.findOne({ 
      type: "online",
      ticketNumber: { $gte: 5001 } 
    }).sort({ ticketNumber: -1 });

    let newTicketNum = lastOnlineTicket ? lastOnlineTicket.ticketNumber + 1 : 5001;

    // ২. যদি ১০,০০০ পার হয়ে যায়
    if (newTicketNum > 10000) {
      return NextResponse.json({ message: "All online tickets are sold out!" }, { status: 400 });
    }

    // ৩. টিকেট ক্রিয়েট করা
    const newTicket = await Ticket.create({
      ticketNumber: newTicketNum,
      type: "online",
      userMail: email,
      status: "sold"
    });

    return NextResponse.json({ success: true, ticket: newTicket });

  } catch (error) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}