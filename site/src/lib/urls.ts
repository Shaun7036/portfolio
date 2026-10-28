const basePath = import.meta.env.BASE_URL === "/"
  ? ""
  : import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path = "/"): string {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  return `${basePath}${normalized}`;
}

export function withoutBase(pathname: string): string {
  if (!basePath || !pathname.startsWith(basePath)) return pathname;
  const stripped = pathname.slice(basePath.length);
  return stripped ? `/${stripped.replace(/^\/+/, "")}` : "/";
}

export function isSection(pathname: string, section: string): boolean {
  const current = withoutBase(pathname);
  return section === "/" ? current === "/" : current.startsWith(section);
}
