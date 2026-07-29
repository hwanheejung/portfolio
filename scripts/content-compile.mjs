import {
  compileContent,
  ContentCompilationError,
} from "./content-compiler.mjs";

const check = process.argv.includes("--check");

try {
  const result = await compileContent({ check });
  console.log(
    `${check ? "Content is current" : "Content compiled"}: ${
      result.articleCount
    } articles, ${result.workCount} works, ${result.experienceCount} experiences, ${
      result.featuredCount
    } home spotlights.`,
  );
} catch (error) {
  if (error instanceof ContentCompilationError) {
    console.error(error.message);
    process.exitCode = 1;
  } else {
    throw error;
  }
}
