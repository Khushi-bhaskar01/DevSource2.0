// import mongoose from "mongoose";

// const taskSchema = new mongoose.Schema({
//   domain: {
//     type: String,
//     enum: ["web", "app", "game"],
//     required: true,
//   },
//   taskid: { type: String, required: true, unique: true },
//   title: { type: String, required: true },
//   description: { type: String, default: "" },
//   users: { type: String, default: "" },
//   points: { type: Number, default: 0 },
// });

// const taskModel =
//   mongoose.models.tasks || mongoose.model("tasks", taskSchema);

// export default taskModel;

import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  domain: {
    type: String,
    enum: ["web", "app", "game"],
    required: true,
  },
  taskid: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  users: {
    type: String,
    default: "",
  },
  points: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const taskModel =
  mongoose.models.tasks || mongoose.model("tasks", taskSchema);

export default taskModel;
