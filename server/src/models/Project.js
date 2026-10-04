import mongoose from "mongoose";
import { getNextSequence } from "./Counter.js";

const projectSchema = new mongoose.Schema(
  {
    _id: { type: String },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 1000 },
    techStack: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: ["web", "design", "mobile", "tool", "game"],
    },
    repoUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    likes: { type: Number, min: 0, default: 0 },
    likedBy: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.likedBy;
        return ret;
      },
    },
  }
);

projectSchema.pre("save", async function (next) {
  if (this.isNew && !this._id) {
    this._id = await getNextSequence("project", "PRJ");
  }
  next();
});

export default mongoose.model("Project", projectSchema);