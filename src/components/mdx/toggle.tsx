import type { ReactNode } from "react";

type Props = {
  summary: string;
  children: ReactNode;
};

const Toggle = ({ summary, children }: Props) => {
  return (
    <details className="article-toggle">
      <summary>{summary}</summary>
      <div className="article-toggle-content">{children}</div>
    </details>
  );
};

export { Toggle };
