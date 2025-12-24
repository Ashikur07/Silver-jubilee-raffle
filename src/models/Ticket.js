import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  ticketNumber: { 
    type: Number, 
    required: true, 
    unique: true, 
    min: 1000, 
    max: 10000 
  },
  type: { 
    type: String, 
    enum: ["online", "offline"], 
    required: true 
  },
  userMail: { 
    type: String, 
    default: null // অফলাইনের জন্য নাল থাকবে
  },
  status: { 
    type: String, 
    default: "sold" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { collection: "ticket_sell" }); // কালেকশন নাম তোমার নোট অনুযায়ী

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);