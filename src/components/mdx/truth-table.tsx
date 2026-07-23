import { z } from "zod";

const TruthTablePropsSchema = z.object({
  labels: z
    .array(
      z.object({
        label: z.string(),
        type: z.enum(["input", "output"]),
      }),
    )
    .min(1),
  data: z.array(z.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))),
});

export type TruthTableProps = z.infer<typeof TruthTablePropsSchema>;

export function TruthTable(props: TruthTableProps) {
  const { labels, data } = TruthTablePropsSchema.parse(props);

  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse text-center text-sm">
        <thead className="bg-muted">
          <tr>
            {labels.map((item) => (
              <th
                className="border-b border-border px-4 py-3 font-semibold"
                key={item.label}
                scope="col"
              >
                {item.label}
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  {item.type}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr className="border-b border-border last:border-0" key={rowIndex}>
              {labels.map((item) => (
                <td className="px-4 py-3 font-mono" key={item.label}>
                  {String(row[item.label] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
