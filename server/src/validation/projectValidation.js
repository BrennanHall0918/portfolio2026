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

// Same shape but every field optional, for PATCH — and explicitly does
// NOT include "likes", so a client can never set the like count
// directly through the update route, only through the dedicated
// atomic /like endpoint.
export const updateProjectSchema = createProjectSchema.partial().strict();