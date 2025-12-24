import mongoose from "mongoose";

const DrawStateSchema = new mongoose.Schema({
  isSpinning: { type: Boolean, default: false }, // চাকা ঘুরছে কি না
  currentPrize: { type: String, default: "" },   // এখন কোন প্রাইজের ড্র হচ্ছে
  lastWinner: { type: Number, default: null },   // শেষ কে জিতেছে
  winnersHistory: [{                             // উইনারদের লিস্ট
    prize: String,
    ticketNumber: Number,
    ownerEmail: String
  }]
});

export default mongoose.models.DrawState || mongoose.model("DrawState", DrawStateSchema);