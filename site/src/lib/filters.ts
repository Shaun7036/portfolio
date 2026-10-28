export interface FilterTags {
  roles: string[];
  skills: string[];
  experience: string[];
}

export type FilterGroupKey = keyof FilterTags;

export interface FilterGroup {
  key: FilterGroupKey;
  label: string;
  options: string[];
}

function uniqueSorted(values: string[]): string[] {
  const byNormalizedValue = new Map<string, string>();
  values.forEach((value) => {
    const cleanValue = value.trim();
    const normalizedValue = cleanValue.toLocaleLowerCase();
    if (cleanValue && !byNormalizedValue.has(normalizedValue)) {
      byNormalizedValue.set(normalizedValue, cleanValue);
    }
  });
  return [...byNormalizedValue.values()].sort((a, b) => a.localeCompare(b));
}

export function buildFilterGroups(tagSets: FilterTags[]): FilterGroup[] {
  return [
    { key: "roles", label: "Role", options: uniqueSorted(tagSets.flatMap((tags) => tags.roles)) },
    { key: "skills", label: "Skills", options: uniqueSorted(tagSets.flatMap((tags) => tags.skills)) },
    { key: "experience", label: "Experience", options: uniqueSorted(tagSets.flatMap((tags) => tags.experience)) },
  ];
}
