import type { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

const WhiteText = ({ children }: Props) => {
  return <span className="text-foreground">{children}</span>;
};

export { WhiteText };
