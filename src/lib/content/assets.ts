import path from "node:path";

export type ContentCollection = "articles" | "experiences" | "about";

export function resolveContentAssetUrl(
  collection: ContentCollection,
  id: string | null,
  assetPath: string,
) {
  if (!assetPath.startsWith("./images/")) {
    return assetPath;
  }

  const relativePath = assetPath.slice(2);
  const segments = ["/_content", collection];

  if (id) {
    segments.push(id);
  }

  segments.push(relativePath);

  return segments.join("/");
}

export function resolveContentAssetPath(
  contentDirectory: string,
  assetPath: string,
) {
  if (!assetPath.startsWith("./images/")) {
    return null;
  }

  const resolved = path.resolve(contentDirectory, assetPath);
  const imagesDirectory = path.resolve(contentDirectory, "images");

  if (
    resolved !== imagesDirectory &&
    !resolved.startsWith(`${imagesDirectory}${path.sep}`)
  ) {
    return null;
  }

  return resolved;
}
