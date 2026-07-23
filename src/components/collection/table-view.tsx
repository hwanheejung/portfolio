import type { Key, ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
};

export type TableViewProps<T> = {
  rows: readonly T[];
  getRowKey: (row: T) => Key;
  columns: readonly TableColumn<T>[];
  caption?: string;
  empty?: ReactNode;
};

export function TableView<T>({
  rows,
  getRowKey,
  columns,
  caption,
  empty = "No rows yet.",
}: TableViewProps<T>) {
  if (rows.length === 0) {
    return <p className="text-muted-foreground">{empty}</p>;
  }

  return (
    <Table>
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {columns.map((column) => (
            <TableHead className={column.className} key={column.id}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={getRowKey(row)}>
            {columns.map((column) => (
              <TableCell className={column.className} key={column.id}>
                {column.cell(row)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
