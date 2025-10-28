import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  passage: String,
  date: String,
  image: String,
}, { timestamps: true });

export default mongoose.models.Program || mongoose.model("Program", ProgramSchema);
