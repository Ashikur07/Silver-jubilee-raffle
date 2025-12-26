import mongoose from "mongoose";

const DrawStateSchema = new mongoose.Schema(
  {
    totalPrizes: { type: Number, default: 0 },
    currentPrizeIndex: { type: Number, default: 0 },
    isSpinning: { type: Boolean, default: false },
    phase: {
      type: String,
      enum: ["idle", "ready", "spinning", "finished"],
      default: "idle",
    },
    lastWinner: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.DrawState ||
  mongoose.model("DrawState", DrawStateSchema);
