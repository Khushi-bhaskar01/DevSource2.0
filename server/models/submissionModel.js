import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionLink: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

submissionSchema.index({ taskId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Submission", submissionSchema);
