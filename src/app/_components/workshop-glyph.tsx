import type { SVGProps } from "react";

export type WorkshopGlyphName =
  | "context"
  | "visible"
  | "loop"
  | "path"
  | "article"
  | "arrow";

export function WorkshopGlyph({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: WorkshopGlyphName }) {
  const sharedProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.6,
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      {...sharedProps}
      {...props}
    >
      {name === "context" ? (
        <>
          <circle cx="12" cy="12" r="7.25" />
          <circle cx="12" cy="12" r="2.25" />
          <path d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2" />
        </>
      ) : null}
      {name === "visible" ? (
        <>
          <path d="M3.25 12s3.35-5 8.75-5 8.75 5 8.75 5-3.35 5-8.75 5-8.75-5-8.75-5Z" />
          <circle cx="12" cy="12" r="2.4" />
        </>
      ) : null}
      {name === "loop" ? (
        <>
          <path d="M7.25 7.5H17a3.5 3.5 0 0 1 3.5 3.5v.5" />
          <path d="m17.75 8.75-1.5-1.25 1.5-1.25M16.75 16.5H7A3.5 3.5 0 0 1 3.5 13v-.5" />
          <path d="m6.25 15.25 1.5 1.25-1.5 1.25" />
        </>
      ) : null}
      {name === "path" ? (
        <>
          <circle cx="5" cy="18.5" r="1.75" />
          <circle cx="19" cy="5.5" r="1.75" />
          <path d="M6.75 18.5h2.5c5.5 0 1-13 7.75-13" />
        </>
      ) : null}
      {name === "article" ? (
        <>
          <path d="M6.25 3.5h8.5l3 3v14H6.25z" />
          <path d="M14.75 3.5v3h3M9.25 11h5.5M9.25 14.5h5.5M9.25 18h3.25" />
        </>
      ) : null}
      {name === "arrow" ? (
        <>
          <path d="M6 18 18 6M8 6h10v10" />
        </>
      ) : null}
    </svg>
  );
}
