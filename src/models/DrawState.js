import mongoose from "mongoose";

const DrawStateSchema = new mongoose.Schema({
  isSpinning: { type: Boolean, default: false },
  drawStartTime: { type: Date }, // ট্রিগার টাইম
  
  // নতুন ফিল্ডস
  totalPrizes: { type: Number, default: 0 }, // মোট ১০টা
  currentPrizeRank: { type: Number, default: 0 }, // এখন ১০, তারপর ৯...
  status: { type: String, default: "IDLE" }, // IDLE, READY, RUNNING, FINISHED
  
  lastWinner: { type: Number },
  currentPrizeLabel: { type: String }, // "10th Prize", "Grand Prize" ইত্যাদি
}, { timestamps: true });

export default mongoose.models.DrawState || mongoose.model("DrawState", DrawStateSchema);