import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tasks",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  submissionLink: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Submitted", "Approved", "Rejected"],
    default: "Submitted",
  },
  feedback: {
    type: String,
    default: "",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const submissionModel =
  mongoose.models.submission || mongoose.model("submissions", submissionSchema);

export default submissionModel;
