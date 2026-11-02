import { getCollection, type CollectionEntry } from "astro:content";

export type ProjectEntry = CollectionEntry<"projects">;
export type PostEntry = CollectionEntry<"writing">;
export type ExperienceEntry = CollectionEntry<"experiences">;

export async function getPublishedProjects(): Promise<ProjectEntry[]> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999));
}

export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection("writing", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getPublishedExperiences(): Promise<ExperienceEntry[]> {
  const experiences = await getCollection("experiences", ({ data }) => !data.draft);
  return experiences.sort((a, b) => a.data.order - b.data.order);
}

function readableMonth(value: string): string {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function experiencePeriod(start: string, end: string): string {
  return `${readableMonth(start)} — ${end === "present" ? "Present" : readableMonth(end)}`;
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
