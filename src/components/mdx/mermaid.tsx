"use client";

import { useEffect, useId, useState } from "react";

type Props = { chart: string; caption?: string };

const Mermaid = ({ chart, caption }: Props) => {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let active = true;
    void import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, theme: "dark" });
      const result = await mermaid.render(`mermaid-${id}`, chart);
      if (active) setSvg(result.svg);
    });
    return () => { active = false; };
  }, [chart, id]);

  return (
    <figure className="my-8 overflow-x-auto rounded-xl border border-border bg-muted/30 p-4">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      {caption ? <figcaption className="mt-3 text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
};

export { Mermaid };
