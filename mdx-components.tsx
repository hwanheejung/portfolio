import type { MDXComponents } from "mdx/types";

import { baseMdxComponents } from "@/components/mdx/registry";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...baseMdxComponents,
    ...components,
  };
}
