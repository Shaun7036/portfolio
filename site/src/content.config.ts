import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    highlight: z.string().optional(),
    category: z.string(),
    tools: z.array(z.string()).default([]),
    year: z.union([z.string(), z.number()]),
    order: z.number().default(999),
    featured: z.boolean().default(false),
    chart: z.enum(["revenue", "retention", "mobility"]).default("revenue"),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
    outcome: z.string(),
    role: z.string(),
    duration: z.string(),
    dataset: z.string(),
    repository: z.string().default(""),
    dashboard: z.string().default(""),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverWidth: z.number().optional(),
    coverHeight: z.number().optional(),
    visualCaption: z.string().optional(),
  }),
});

const writing = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    example: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, writing };
