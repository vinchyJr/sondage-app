import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["ouverte", "qcm"] },
  question: { type: String, required: true },
  options: [{ type: String }], 
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now }, 
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Survey = mongoose.models.Survey || mongoose.model("Survey", SurveySchema);
export default Survey;
