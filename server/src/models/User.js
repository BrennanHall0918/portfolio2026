import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    // Bumped whenever we want to invalidate all of a user's existing
    // tokens at once (e.g. a password change or manual deactivation) —
    // requireAuth checks this against the number baked into the token.
    tokenVersion: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // passwordHash must never leave the server in any response,
        // under any circumstance — stripped here at the schema level
        // rather than trusting every controller to remember to omit it.
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export default mongoose.model("User", userSchema);