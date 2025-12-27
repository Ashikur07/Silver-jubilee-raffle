import mongoose from "mongoose";

const DrawStateSchema = new mongoose.Schema({
  isSpinning: { type: Boolean, default: false },        // চাকা ঘুরছে কি না
  currentPrize: { type: String, default: "" },          // এখন কোন প্রাইজের ড্র হচ্ছে
  lastWinner: { type: Number, default: null },          // শেষ কে জিতেছে
  totalPrizes: { type: Number, default: 0 },            // মোট কয়টা প্রাইজ সেট করা হয়েছে (10, 5 etc)
  currentPrizeNumber: { type: Number, default: 0 },     // এখন কোন নম্বরের প্রাইজ (10 থেকে শুরু করে 1 এ নামবে)
  isSetupMode: { type: Boolean, default: false },       // শুধু সেটআপ হয়েছে, স্পিন শুরু হয়নি
  winnersHistory: [{                                     // উইনারদের লিস্ট
    prize: String,
    prizeNumber: Number,
    ticketNumber: Number,
    ownerEmail: String,
    drawDate: { type: Date, default: Date.now }
  }]
});

export default mongoose.models.DrawState || mongoose.model("DrawState", DrawStateSchema);