import mongoose from "mongoose";
import Project from "../models/Project.js";

export async function getAllProjects(req, res, next) {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category && typeof category === "string") {
      filter.category = category;
    }

    if (search && typeof search === "string") {
      filter.title = { $regex: search, $options: "i" };
    }

    const projects = await Project.find(mongoose.sanitizeFilter(filter)).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    next(err);
  }
}

export async function getProjectById(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function createProject(req, res, next) {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    next(err);
  }
}

export async function updateProject(req, res, next) {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
}

export async function deleteProject(req, res, next) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (err) {
    next(err);
  }
}

export async function likeProject(req, res, next) {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, likedBy: { $ne: req.user.id } },
      { $inc: { likes: 1 }, $addToSet: { likedBy: req.user.id } },
      { returnDocument: "after" }
    );

    if (!project) {
      const exists = await Project.findById(req.params.id);
      if (!exists) {
        return res.status(404).json({ message: "Project not found" });
      }
      return res.status(409).json({ message: "Already liked" });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
}