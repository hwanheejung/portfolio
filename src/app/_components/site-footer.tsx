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
        { label: "Work", href: "/work" },
        { label: "Articles", href: "/articles" },
        { label: "About", href: "/about" },
      ],
    },
    {
      title: "Selected work",
      links: home.featuredWorks.map((work) => ({
        label: work.title,
        href: `/work/${work.slug}`,
      })),
    },
    {
      title: "Articles",
      links: Object.entries(taxonomy.kinds)
        .filter(([id]) =>
          home.articles.some((article) => article.kind === id),
        )
        .toSorted(([, a], [, b]) => a.order - b.order)
        .map(([id, kind]) => ({
          label: kind.label,
          href: `/articles#${id}`,
        })),
    },
  ];
  return (
    <footer className="mt-0 border-t border-black/10 bg-[#f2f1ea] text-[#11120f]">
      <div className="page-shell py-16 md:py-20">
        <p className="display-font mt-5 max-w-2xl text-3xl tracking-[-0.04em] md:text-5xl">
          Glad we could cross paths.
        </p>
        <div className="mt-14 grid grid-cols-2 gap-10 text-sm md:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="eyebrow text-black/45">{group.title}</p>
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
            <p className="eyebrow text-black/45">Let&apos;s connect</p>
            <ul className="mt-4 space-y-3 text-black/55">
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
