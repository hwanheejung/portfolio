declare module "*.mdx" {
  import type { MDXContent } from "mdx/types";
  import type { ArticleSummary } from "./src/__generated__/content";

  export const metadata: Omit<ArticleSummary, "thumbnailUrl" | "toc">;
  const Content: MDXContent;
  export default Content;
}
