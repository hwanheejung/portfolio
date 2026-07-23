"use client";

import { useMemo, useState } from "react";

import { z } from "zod";

import { Button } from "@/shared/ui/button";

const CircuitSchema = z.object({
  id: z.string().min(1),
  initialJSON: z.object({
    nodes: z
      .array(
        z
          .object({
            id: z.string(),
            label: z.string().optional(),
          })
          .passthrough(),
      )
      .default([]),
    edges: z
      .array(
        z
          .object({
            from: z.string(),
            to: z.string(),
          })
          .passthrough(),
      )
      .default([]),
  }),
});

export type CircuitProps = z.infer<typeof CircuitSchema>;

export function Circuit(props: CircuitProps) {
  const { id, initialJSON } = useMemo(() => CircuitSchema.parse(props), [props]);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);

  const toggleNode = (nodeId: string) => {
    setActiveNodes((current) =>
      current.includes(nodeId)
        ? current.filter((candidate) => candidate !== nodeId)
        : [...current, nodeId],
    );
  };

  return (
    <section
      aria-label={`Interactive circuit ${id}`}
      className="my-8 rounded-2xl border border-border bg-card p-5 md:p-7"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Circuit demo</p>
          <p className="text-sm text-muted-foreground">
            Toggle the input nodes to inspect the state.
          </p>
        </div>
        <Button
          onClick={() => setActiveNodes([])}
          size="sm"
          variant="outline"
        >
          Reset
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {initialJSON.nodes.map((node, index) => {
          const isActive = activeNodes.includes(node.id);
          return (
            <div className="contents" key={node.id}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted-foreground">
                  →
                </span>
              ) : null}
              <button
                aria-pressed={isActive}
                className="min-w-20 rounded-xl border border-border px-4 py-3 font-mono text-sm transition-colors data-[active=true]:border-foreground data-[active=true]:bg-foreground data-[active=true]:text-background"
                data-active={isActive}
                onClick={() => toggleNode(node.id)}
                type="button"
              >
                {node.label ?? node.id}: {isActive ? "1" : "0"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-xs text-muted-foreground">
        {initialJSON.edges.length} connection
        {initialJSON.edges.length === 1 ? "" : "s"}
      </p>
    </section>
  );
}
