import { mkdir, rm, writeFile } from "node:fs/promises";

const pathPrefix = `/${(process.env.PATH_PREFIX || "/").replace(/^\/+|\/+$/g, "")}/`.replace(/\/{2,}/g, "/");

function dateValue(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export default function (eleventyConfig) {
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: true });
  eleventyConfig.addGlobalData("buildYear", new Date().getUTCFullYear());
  eleventyConfig.addFilter("isSection", (current, section) => section === "/" ? current === section : String(current).startsWith(section));
  eleventyConfig.addFilter("absoluteUrl", (path, origin) => `${String(origin).replace(/\/$/, "")}${path}`);
  eleventyConfig.addFilter("featured", (items) => (items || []).filter(item => item.data.featured));
  eleventyConfig.addFilter("categories", (items) => [...new Set((items || []).map(item => item.data.category).filter(Boolean))]);
  eleventyConfig.addPassthroughCopy("src/assets");

  // Clean full builds so a newly hidden draft cannot survive in the output.
  eleventyConfig.on("eleventy.before", async () => {
    if (process.env.ELEVENTY_RUN_MODE === "build") {
      await rm("_site", { recursive: true, force: true });
    }
  });
  eleventyConfig.on("eleventy.after", async () => {
    await mkdir("_site", { recursive: true });
    await writeFile("_site/.nojekyll", "");
  });

  eleventyConfig.addPreprocessor("drafts", "njk,md,html", (data) => {
    if (data.draft === true) return false;
  });

  eleventyConfig.addFilter("readableDate", (value) => {
    const date = dateValue(value);
    return date ? new Intl.DateTimeFormat("en-US", {
      month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
    }).format(date) : "";
  });
  eleventyConfig.addFilter("isoDate", (value) => dateValue(value)?.toISOString().slice(0, 10) || "");
  eleventyConfig.addFilter("readingTime", (value = "") => {
    const text = String(value).replace(/<[^>]*>/g, " ").trim();
    return Math.max(1, Math.ceil((text.match(/\S+/g)?.length || 0) / 220));
  });
  eleventyConfig.addFilter("limit", (items, count) => (items || []).slice(0, count));
  eleventyConfig.addFilter("hasExamples", (items) => (items || []).some((item) => item?.data?.example === true || item?.example === true));
  eleventyConfig.addFilter("pad", (value, width = 2) => String(value).padStart(width, "0"));

  eleventyConfig.addCollection("projects", (collection) =>
    collection.getFilteredByTag("projects")
      .filter((item) => item.data.draft !== true)
      .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
  );
  eleventyConfig.addCollection("posts", (collection) =>
    collection.getFilteredByTag("posts")
      .filter((item) => item.data.draft !== true)
      .sort((a, b) => b.date - a.date)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix
  };
}
