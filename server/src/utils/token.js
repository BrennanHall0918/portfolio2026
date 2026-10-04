import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}