import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  points: { type: Number, default: 0 },
  deadline: { type: String, required: true },
});
const taskModel = mongoose.models.task || mongoose.model("tasks", taskSchema);
export default taskModel;
