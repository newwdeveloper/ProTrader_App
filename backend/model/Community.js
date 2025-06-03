import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  totalProfit: { type: Number, default: 0 },
  winRate: { type: Number, default: 0 },
  tradesShared: [{ type: mongoose.Schema.Types.ObjectId, ref: "Trade" }],
  createdAt: { type: Date, default: Date.now },
});

const Community = mongoose.model("Community", communitySchema);

export default Community;
