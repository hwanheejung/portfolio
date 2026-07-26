import type { Metadata } from "next";

import "./globals.css";

import { SiteFooter } from "./_components/site-footer";
import { SiteNavigation } from "./_components/site-navigation";
import { ContentDevTools } from "@/devtools";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Hwanhee — Product Engineer",
    template: "%s — Hwanhee",
  },
  description:
    "Building human-centered products through software, systems, and thoughtful collaboration.",
  openGraph: {
    title: "Hwanhee — Product Engineer",
    description:
      "Building human-centered products through software, systems, and thoughtful collaboration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="ko">
      <body>
        <SiteNavigation />
        <main>{children}</main>
        <SiteFooter />
        {process.env.NODE_ENV === "development" ? <ContentDevTools /> : null}
      </body>
    </html>
  );
}
