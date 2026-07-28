import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "metadata" }],
    ],
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          keepBackground: false,
          theme: {
            dark: "github-dark",
            light: "github-light",
          },
        },
      ],
    ],
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

export default withMDX(nextConfig);
