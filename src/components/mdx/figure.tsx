import Image from "next/image";

import { z } from "zod";

const FigurePropsSchema = z.object({
  src: z.string().min(1),
  alt: z.string().default(""),
  caption: z.string().optional(),
  width: z.number().positive().default(1200),
  height: z.number().positive().default(720),
});

export type FigureProps = z.input<typeof FigurePropsSchema>;

export function Figure(props: FigureProps) {
  const { src, alt, caption, width, height } = FigurePropsSchema.parse(props);

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          alt={alt}
          className="h-auto w-full"
          height={height}
          src={src}
          width={width}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
