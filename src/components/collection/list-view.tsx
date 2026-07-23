import type { Key, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type ListViewProps<T> = {
  items: readonly T[];
  getKey: (item: T) => Key;
  renderItem: (item: T, index: number) => ReactNode;
  empty?: ReactNode;
  className?: string;
};

export function ListView<T>({
  items,
  getKey,
  renderItem,
  empty = <p className="text-muted-foreground">No items yet.</p>,
  className,
}: ListViewProps<T>) {
  if (items.length === 0) {
    return <>{empty}</>;
  }

  return (
    <ul className={cn("divide-y divide-border", className)}>
      {items.map((item, index) => (
        <li key={getKey(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}
