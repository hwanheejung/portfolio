declare module "*.mdx" {
  import type { MDXContent } from "mdx/types";
  import type { ArticleMetadata } from "./schema/article";

  export const metadata: ArticleMetadata;
  const Content: MDXContent;
  export default Content;
}
