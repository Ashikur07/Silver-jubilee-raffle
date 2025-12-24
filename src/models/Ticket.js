import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  ticketNumber: { type: Number, required: true, unique: true },
  status: { 
    type: String, 
    enum: ["available", "sold"], 
    default: "available" 
  },
  type: { 
    type: String, 
    enum: ["online", "offline"], 
    required: true 
  },
  ownerEmail: { type: String, default: null }, // অনলাইনে কিনলে মেইল থাকবে
  soldAt: { type: Date, default: null }
});

export default mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema);