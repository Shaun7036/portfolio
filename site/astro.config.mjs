import { defineConfig } from "astro/config";

const rawBase = process.env.ASTRO_BASE || process.env.PATH_PREFIX || "/";
const base = rawBase === "/" ? "/" : `/${rawBase.replace(/^\/+|\/+$/g, "")}`;

export default defineConfig({
  site: process.env.ASTRO_SITE || undefined,
  base,
  output: "static",
  trailingSlash: "always",
  build: {
    assets: "assets",
  },
});
