import mongoose from "mongoose";

const userTaskSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    taskid: { type: String, required: true },

    github: { type: String },
    demo: { type: String },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);


userTaskSchema.index({ email: 1, taskid: 1 }, { unique: true });

export default mongoose.model("UserTask", userTaskSchema);
