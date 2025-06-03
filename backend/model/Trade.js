import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symbol: { type: String, required: true }, // e.g., RELIANCE.NS
  entryPrice: { type: Number, required: true },
  exitPrice: { type: Number },
  quantity: { type: Number, required: true },
  profitLoss: { type: Number },
  holdingPeriod: { type: Number }, // Days
  entryDate: { type: Date, default: Date.now },
  exitDate: { type: Date },
  riskPerTrade: { type: Number, default: 0.01 }, // 1% risk (SEBI-compliant)
  vcpData: {
    contractions: { type: Number },
    pivotPoint: { type: Number },
    rsScore: { type: Number },
  },
});

const Trade = mongoose.model("Trade", tradeSchema);

export default Trade;
