import Link from "next/link";

import { getHomeContent, getTaxonomy } from "@/lib/content";

export async function SiteFooter() {
  const [home, taxonomy] = await Promise.all([
    getHomeContent(),
    getTaxonomy(),
  ]);
  const footerGroups = [
    {
      title: "Pages",
      links: [
        { label: "Home", href: "/" },
        { label: "Articles", href: "/articles" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Featured",
      links: home.featuredContent.map((article) => ({
        label: article.title,
        href: `/articles/${article.slug}`,
      })),
    },
    {
      title: "Articles",
      links: Object.entries(taxonomy.kinds)
        .toSorted(([, a], [, b]) => a.order - b.order)
        .map(([id, kind]) => ({
          label: kind.label,
          href: `/articles#${id}`,
        })),
    },
  ];
  return (
    <footer className="mt-24 border-t border-border bg-[#100e0c] text-white md:mt-32">
      <div className="page-shell py-16 md:py-20">
        <p className="display-font mt-5 max-w-2xl text-3xl tracking-[-0.04em] md:text-5xl">
          Glad we could cross paths.
        </p>
        <div className="mt-14 grid grid-cols-2 gap-10 text-sm md:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="eyebrow text-white/55">{group.title}</p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="footer-link"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow text-white/55">Let&apos;s connect</p>
            <ul className="mt-4 space-y-3 text-white/55">
              <li>LinkedIn</li>
              <li>GitHub</li>
              <li>Email</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
