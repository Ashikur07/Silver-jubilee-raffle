import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { startRange, endRange } = await req.json(); // যেমন: 1001, 1050

    if (startRange < 1000 || endRange > 5000) {
      return NextResponse.json({ message: "Offline range must be between 1000 and 5000" }, { status: 400 });
    }

    const tickets = [];
    for (let i = Number(startRange); i <= Number(endRange); i++) {
      tickets.push({
        ticketNumber: i,
        type: "offline",
        status: "sold",
        userMail: null
      });
    }

    // বাল্ক ইনসার্ট (একসাথে সব সেভ হবে, ডুপ্লিকেট হলে এরর ইগনোর করার জন্য option দেয়া যেতে পারে)
    // সিম্পল রাখার জন্য insertMany দিচ্ছি, ডুপ্লিকেট থাকলে এরর দিবে
    await Ticket.insertMany(tickets, { ordered: false }).catch(err => {
        // ডুপ্লিকেট এরর ইগনোর করি, বাকিগুলো সেভ হোক
    });

    return NextResponse.json({ success: true, count: tickets.length });

  } catch (error) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}