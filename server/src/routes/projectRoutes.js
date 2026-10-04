import express from "express";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
} from "../controllers/projectController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createProjectSchema, updateProjectSchema } from "../validation/projectValidation.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

router.post("/:id/like", requireAuth, likeProject);

router.post("/", requireAuth, requireRole("admin"), validate(createProjectSchema), createProject);
router.patch("/:id", requireAuth, requireRole("admin"), validate(updateProjectSchema), updateProject);
router.delete("/:id", requireAuth, requireRole("admin"), deleteProject);

export default router;