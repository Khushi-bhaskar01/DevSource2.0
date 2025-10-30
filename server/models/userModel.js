import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },

    badges: [
      {
        badgeId: { type: String },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    aboutMe: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    profilePicture: { type: String, default: "" },

    branch: { type: String, default: "" },
    year: { type: String, default: "" },
    location: { type: String, default: "" },

    domain: {
      type: [String],
      enum: ["web", "app", "game"],
      default: [],
    },

    points: { type: Number, default: 0, immutable: true }, 
    
    role: {
      type: String,
      enum: ["student", "admin","superadmin"],
      default: "student",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
