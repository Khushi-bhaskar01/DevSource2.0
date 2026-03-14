import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  points: { type: Number, default: 0 },
  teamName: { type: String, default: "" },
  deployedLink: { type: String, default: "" },
});
const taskModel = mongoose.models.Task || mongoose.model("Task", taskSchema);
export default taskModel;
