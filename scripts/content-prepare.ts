import { cp, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

import { CONTENT_ROOT, PROJECT_ROOT } from "../src/lib/content";

const outputRoot = path.join(PROJECT_ROOT, "public", "_content");

async function copyImages(source: string, destination: string) {
  try {
    await cp(source, destination, {
      recursive: true,
      force: true,
    });
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }
    throw error;
  }
}

async function copyCollection(collection: "articles" | "experiences") {
  const sourceRoot = path.join(CONTENT_ROOT, collection);
  const entries = await readdir(sourceRoot, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) {
      continue;
    }

    await copyImages(
      path.join(sourceRoot, entry.name, "images"),
      path.join(outputRoot, collection, entry.name, "images"),
    );
  }
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(outputRoot, { recursive: true });

await Promise.all([
  copyCollection("articles"),
  copyCollection("experiences"),
  copyImages(
    path.join(CONTENT_ROOT, "about", "images"),
    path.join(outputRoot, "about", "images"),
  ),
]);

console.log("Content assets prepared.");
