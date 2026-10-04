import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Project from "../src/models/Project.js";
import Counter from "../src/models/Counter.js";
import User from "../src/models/User.js";

dotenv.config();

const sampleProjects = [
  {
    title: "Windows 98 Portfolio",
    description: "A Windows 98-themed portfolio SPA with draggable windows, real routing synced to a desktop UI, and live GitHub project data.",
    techStack: ["React", "Vite", "react-router-dom", "react-rnd"],
    category: "web",
    repoUrl: "https://github.com/BrennanHall0918/portfolio2026",
    liveUrl: "",
    imageUrl: "",
    featured: true,
  },
  {
    title: "Music Store Database Application",
    description: "A relational MySQL database containing artists, albums, tracks, genres, labels, and related entities, with joins and aggregation queries.",
    techStack: ["MySQL", "SQL"],
    category: "tool",
  },
  {
    title: "Digital Timekeeper Web Application",
    description: "An interactive JavaScript application featuring dynamic UI updates, user settings, and responsive design.",
    techStack: ["JavaScript", "HTML", "CSS"],
    category: "web",
  },
  {
    title: "Virtual Soundboard Application",
    description: "An interactive audio application using JavaScript and the Web Audio API, with user interaction handling and dynamic audio controls.",
    techStack: ["JavaScript", "Web Audio API"],
    category: "web",
  },
  {
    title: "Sample Project Five",
    description: "Placeholder description — replace with a real project.",
    techStack: ["Node.js", "Express"],
    category: "tool",
  },
  {
    title: "Sample Project Six",
    description: "Placeholder description — replace with a real project.",
    techStack: ["React"],
    category: "mobile",
  },
];

async function seed() {
  console.log("1: starting seed()");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("2: mongoose connected");

  await Project.deleteMany({});
  console.log("3: projects cleared");

  await Counter.deleteMany({});
  console.log("4: counters cleared");

  await User.deleteMany({});
  console.log("4b: users cleared");

  for (const project of sampleProjects) {
    await Project.create(project);
  }
  console.log("5: projects inserted");

  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  await User.create({
    email: process.env.ADMIN_EMAIL.toLowerCase(),
    passwordHash,
    role: "admin",
  });
  console.log(`Created admin user: ${process.env.ADMIN_EMAIL}`);

  await mongoose.disconnect();
  console.log("6: disconnected, done");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});