export function assetUrl(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("#")) {
    return path;
  }
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
