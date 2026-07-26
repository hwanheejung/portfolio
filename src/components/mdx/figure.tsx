import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

const Figure = ({
  src,
  alt = "",
  caption,
  width = 1200,
  height = 720,
}: Props) => {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-[1.6rem] border border-border bg-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.08),0_22px_60px_rgb(0_0_0/0.18)]">
        <Image
          alt={alt}
          className="h-auto w-full"
          height={height}
          src={src}
          width={width}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 px-1 text-[0.82rem] leading-5 tracking-[0.01em] text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};

export { Figure };
