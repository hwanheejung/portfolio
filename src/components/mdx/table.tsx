import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type Props = {
  columns: ReactNode[];
  headerColumn?: boolean;
  headerRow?: boolean;
  rows: ReactNode[][];
};

const Table = ({
  columns,
  headerColumn = false,
  headerRow = false,
  rows,
}: Props) => {
  return (
    <div className="my-8 w-full overflow-x-auto rounded-xl border border-border/80 bg-card/35 shadow-[0_12px_30px_rgb(0_0_0/0.06)]">
      <table
        className={cn(
          "w-full min-w-[40rem] border-collapse text-left text-[0.95rem] leading-6",
          "[&_td]:border-t [&_td]:border-border/70 [&_td]:px-4 [&_td]:py-3.5 [&_td]:align-top",
          "[&_th]:px-4 [&_th]:py-3.5 [&_th]:text-left [&_th]:font-medium [&_th]:align-top",
          headerRow && "[&_thead]:bg-muted/75 [&_thead_th]:font-semibold [&_thead_th]:text-foreground",
          headerColumn && "[&_tbody_th]:border-t [&_tbody_th]:border-border/70 [&_tbody_th]:bg-muted/45 [&_tbody_th]:text-foreground",
        )}
      >
        {headerRow ? (
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) =>
                headerColumn && columnIndex === 0 ? (
                  <th key={columnIndex} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={columnIndex}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
