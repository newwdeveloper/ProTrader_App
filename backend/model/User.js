import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  balance: { type: Number, default: 300000 },
});

const User = mongoose.model("User", userSchema);

export default User;
