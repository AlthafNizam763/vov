import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  name: String,
  Description: String,
  image: String,
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
