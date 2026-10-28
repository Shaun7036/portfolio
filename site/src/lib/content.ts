import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type PostEntry = CollectionEntry<"writing">;

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection("writing", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function projectCategories(projects: ProjectEntry[]): string[] {
  return [...new Set(projects.map((project) => project.data.category).filter(Boolean))];
}

export function readableDate(value: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export function isoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function readingTime(value = ""): number {
  const plainText = value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_`\[\]()~-]/g, " ")
    .trim();
  return Math.max(1, Math.ceil((plainText.match(/\S+/g)?.length ?? 0) / 220));
}

export function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}
