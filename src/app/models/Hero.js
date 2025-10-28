import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema({
  heading: String,
  headline: String,
  passage: String,
  amount: String,
}, { timestamps: true });

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
