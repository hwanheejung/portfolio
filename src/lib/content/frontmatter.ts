import YAML from "yaml";

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export type MdxDocument = {
  data: unknown;
  body: string;
};

export function parseMdxDocument(source: string): MdxDocument {
  const match = FRONTMATTER_PATTERN.exec(source);

  if (!match) {
    throw new Error("MDX files must begin with YAML frontmatter.");
  }

  return {
    data: YAML.parse(match[1] ?? ""),
    body: match[2] ?? "",
  };
}

export function serializeMdxDocument(data: unknown, body: string) {
  const frontmatter = YAML.stringify(data, {
    lineWidth: 0,
  }).trimEnd();

  return `---\n${frontmatter}\n---\n\n${body.trimStart()}`;
}
