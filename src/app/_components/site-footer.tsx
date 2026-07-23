import Link from "next/link";

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
    title: "Featured work",
    links: [
      { label: "Karrot", href: "/articles?works=karrot#works" },
      { label: "Naver", href: "/articles?works=naver#works" },
    ],
  },
  {
    title: "Articles",
    links: [
      { label: "Automation", href: "/articles#automation" },
      { label: "Deep Dive", href: "/articles#deep-dive" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-black text-white md:mt-32">
      <div className="page-shell py-12 md:py-16">
        <p className="display-font text-center text-xl uppercase">
          Thanks for stopping by!
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-10 text-sm md:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <p className="display-font text-xs uppercase text-white/60">
                {group.title}
              </p>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link className="hover:text-accent" href={link.href}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="display-font text-xs uppercase text-white/60">
              Let&apos;s connect
            </p>
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
