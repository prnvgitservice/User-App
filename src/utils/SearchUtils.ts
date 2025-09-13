// Utility functions (searchUtils.ts)
export interface SearchData {
  category: string;
  city: string;
  state: string;
  pincode?: string;
  areaName?: string;
  subAreaName?: string;
}

export function buildSlug(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, '-');
}

export function buildSearchPath(categorySlug: string, city: string, areaName?: string, pincode?: string, subAreaName?: string): string {
  const segments: string[] = [categorySlug, buildSlug(city)];
  if (areaName && pincode) {
    segments.push(`${buildSlug(areaName)}-${pincode}`);
  }
  if (subAreaName) {
    segments.push(buildSlug(subAreaName));
  }
  return '/' + segments.join('/');
}