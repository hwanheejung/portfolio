import {
  Children,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/shared/lib/cn";

type Props = {
  children: ReactNode;
};

type ColumnProps = {
  align?: "start" | "center";
  children?: ReactNode;
  width?: number;
};

const Columns = ({ children }: Props) => {
  const columns = Children.toArray(children).filter(
    isValidElement
  ) as ReactElement<ColumnProps>[];
  const count = columns.length;

  if (columns.some((column) => column.type !== Column)) {
    throw new Error(
      "Columns only accepts Column components as direct children."
    );
  }

  if (count < 2 || count > 6) {
    throw new Error("Columns requires between 2 and 6 Column children.");
  }

  const template = columns.map(getColumnWidth).join(" ");

  return (
    <div
      className="my-1 grid grid-cols-1 gap-3 md:grid-cols-(--mdx-column-template) md:gap-4"
      data-column-count={count}
      style={{ "--mdx-column-template": template } as CSSProperties}
    >
      {columns}
    </div>
  );
};

export { Column, Columns };

const Column = ({ align = "start", children }: ColumnProps) => {
  return (
    <div
      className={cn(
        "min-w-0 *:first:mt-0 *:last:mb-0",
        align === "center"
          ? "flex flex-col items-center gap-3 text-center"
          : "space-y-5"
      )}
    >
      {children}
    </div>
  );
};

const getColumnWidth = (column: ReactElement<ColumnProps>) => {
  const width = column.props.width ?? 1;

  if (!Number.isFinite(width) || width <= 0 || width > 12) {
    throw new Error("Column width must be greater than 0 and at most 12.");
  }

  return `${width}fr`;
};
