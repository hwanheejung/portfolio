import { access, readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";

import YAML from "yaml";

const FRONTMATTER_PATTERN =
  /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export const today = () => new Date().toISOString().slice(0, 10);

export function assertSlug(slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? "")) {
    throw new Error("Use a lowercase kebab-case article slug.");
  }
  return slug;
}

export function titleFromSlug(slug) {
  return slug
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function parseCommaSeparated(value) {
  return [
    ...new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

export async function ask(question, fallback) {
  if (!process.stdin.isTTY) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Interactive input required: ${question}`);
  }

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const suffix = fallback ? ` (${fallback})` : "";
    const answer = (await readline.question(`${question}${suffix}: `)).trim();
    return answer || fallback || "";
  } finally {
    readline.close();
  }
}

export async function readArticleDocument(articleFile) {
  const source = await readFile(articleFile, "utf8");
  const match = FRONTMATTER_PATTERN.exec(source);
  if (!match) throw new Error("Article must begin with YAML frontmatter.");
  return {
    body: match[2] ?? "",
    data: YAML.parse(match[1] ?? ""),
    source,
  };
}

export function serializeArticle(data, body) {
  return `---\n${YAML.stringify(data, { lineWidth: 0 }).trimEnd()}\n---\n\n${body.trimStart()}`;
}

export async function assertPathExists(targetPath, message) {
  try {
    await access(targetPath);
  } catch {
    throw new Error(message);
  }
}

export async function chooseArticleClassification(taxonomy, current = {}) {
  const kindIds = Object.keys(taxonomy.kinds);
  const fallbackKind =
    current.kind && kindIds.includes(current.kind)
      ? current.kind
      : kindIds[0];
  const kind = await ask(`Kind [${kindIds.join(", ")}]`, fallbackKind);
  if (!kindIds.includes(kind)) {
    throw new Error(
      `Unknown kind "${kind}". Choose one of: ${kindIds.join(", ")}.`,
    );
  }

  const topicIds = Object.keys(taxonomy.topics);
  const topics = parseCommaSeparated(
    await ask(
      `Topics [${topicIds.join(", ")}]`,
      (current.topics ?? []).join(","),
    ),
  );
  for (const topic of topics) {
    if (!topicIds.includes(topic)) {
      throw new Error(
        `Unknown topic "${topic}". Choose from: ${topicIds.join(", ")}.`,
      );
    }
  }

  return { kind, topics };
}
