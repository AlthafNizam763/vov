import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema({
  title: String,
  passage: String,
  amount: String,
  detail: String,
  image: String, // base64 or URL
}, { timestamps: true });

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);
