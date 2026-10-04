import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();
connectDB();

// Blocks MongoDB operator injection (e.g. a malicious $gt/$ne sneaking
// into a query from user input) by stripping any key starting with $
// or containing a . from query filters built off user-supplied data.
mongoose.set("sanitizeFilter", true);

const app = express();

// Must be the FIRST middleware — sets a batch of security-related HTTP
// headers (things like X-Content-Type-Options, X-Frame-Options) before
// anything else runs.
app.use(helmet());

// Narrowed to exactly your frontend's URL — not a wildcard "*" — so
// only your own site's requests are allowed to actually read the
// response (the browser enforces this via CORS, not the server
// blocking the request outright, but it's the correct configuration
// either way).
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));