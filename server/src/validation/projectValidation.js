import { z } from "zod";

const categoryEnum = z.enum(["web", "design", "mobile", "tool", "game"]);

export const createProjectSchema = z.object({
  title: z.string().trim().min(1).max(100),
  description: z.string().min(1).max(1000),
  techStack: z.array(z.string()).optional(),
  category: categoryEnum,
  repoUrl: z.string().optional(),
  liveUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().optional(),
}).strict();

export const updateProjectSchema = createProjectSchema.partial().strict();