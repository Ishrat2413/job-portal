import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["jobSeeker", "employer", "admin"],
      default: "jobSeeker",
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.role === "admin" || this.role === "jobSeeker";
      },
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profile: {
      bio: {
        type: String,
      },
      skills: [
        {
          type: String,
        },
      ],
      resume: {
        type: String, // URL of resume file
      },
      resumeOriginalName: {
        type: String, // pdf or what
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
      profilePhoto: {
        type: String,
        default: "",
      },
    },
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
