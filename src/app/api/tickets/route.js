import dbConnect from "@/lib/db";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

// GET: টিকেট লিস্ট এবং স্ট্যাটাস (Dynamic Grid Logic)
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = 50; // প্রতি পেজে ৫০টা করে দেখাবে (তোমার রিকোয়ারমেন্ট অনুযায়ী)
  
  // রেঞ্জ ক্যালকুলেশন (5001 থেকে শুরু)
  const startNum = 5001 + (page - 1) * limit;
  const endNum = Math.min(startNum + limit - 1, 10000); // ১০,০০০ এর বেশি যাবে না

  if (startNum > 10000) {
    return NextResponse.json({ tickets: [], total: 5000, sold: 0 });
  }

  try {
    // ১. শুধু এই রেঞ্জের মধ্যে বিক্রি হওয়া টিকেটগুলো খুঁজি
    const soldTickets = await Ticket.find({
      ticketNumber: { $gte: startNum, $lte: endNum },
      status: "sold"
    });

    // ২. মিক্সড লিস্ট তৈরি (Sold + Available)
    const mixedTickets = [];
    for (let i = startNum; i <= endNum; i++) {
      // চেক করি এই নাম্বারটা বিক্রি হয়েছে কি না
      const isSold = soldTickets.find(t => t.ticketNumber === i);

      if (isSold) {
        mixedTickets.push(isSold); // বিক্রি হলে ডাটাবেসেরটা দাও
      } else {
        // বিক্রি না হলে ডামি Available অবজেক্ট বানাও
        mixedTickets.push({
          ticketNumber: i,
          status: "available",
          type: "online",
          _id: `temp_${i}` // টেম্পোরারি আইডি
        });
      }
    }

    // ৩. টোটাল স্ট্যাটাস
    const totalSold = await Ticket.countDocuments({ 
      ticketNumber: { $gte: 5001, $lte: 10000 }, 
      status: "sold" 
    });

    return NextResponse.json({
      tickets: mixedTickets,
      total: 5000, // ৫০০০ ফিক্সড (৫০০১-১০০০০)
      sold: totalSold
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: টিকেট কেনা (Create Ticket on Buy)
export async function POST(req) {
  await dbConnect();
  const { ticketNumbers, email } = await req.json(); // এখন ticketIds না, ticketNumbers নিব

  try {
    // ১. ডাবল চেক: কেউ কি এর মধ্যে কিনে ফেলেছে?
    const existing = await Ticket.find({
      ticketNumber: { $in: ticketNumbers },
      status: "sold"
    });

    if (existing.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: `Ticket ${existing.map(t=>t.ticketNumber).join(", ")} already sold!` 
      }, { status: 400 });
    }

    // ২. নতুন টিকেট ডাটাবেসে সেভ করা
    const newTickets = ticketNumbers.map(num => ({
      ticketNumber: num,
      type: "online",
      status: "sold",
      ownerEmail: email || "guest",
      soldAt: new Date()
    }));

    await Ticket.insertMany(newTickets);

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}