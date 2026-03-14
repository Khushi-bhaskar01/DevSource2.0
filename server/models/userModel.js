import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firebaseUID: { type: String, required: true, unique: true },

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

    points: { type: Number, default: 0 },

    role: {
      type: String,
      enum: ["student", "admin", "superadmin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
