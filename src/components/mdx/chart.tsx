type Props = {
  ariaLabel: string;
  caption?: string;
  series: Series[];
  xTicks: XTick[];
  yMax: number;
  yTicks?: number[];
};

type Series = {
  color?: "foreground" | "accent" | "muted";
  label: string;
  values: number[];
};

type XTick = {
  index: number;
  label: string;
};

const Chart = ({
  ariaLabel,
  caption,
  series,
  xTicks,
  yMax,
  yTicks = getDefaultYTicks(yMax),
}: Props) => {
  const pointCount = Math.max(
    2,
    ...series.map(({ values }) => values.length),
  );

  return (
    <figure className="my-8">
      <svg
        aria-label={ariaLabel}
        className="h-auto w-full overflow-visible"
        role="img"
        viewBox="0 0 1200 520"
      >
        {yTicks.map((value) => {
          const y = getY(value, yMax);

          return (
            <g key={value}>
              <line
                className="stroke-border"
                strokeWidth="1"
                x1={chart.left}
                x2={chart.right}
                y1={y}
                y2={y}
              />
              <text
                className="fill-muted-foreground text-[13px]"
                textAnchor="end"
                x={chart.left - 14}
                y={y + 5}
              >
                {value}
              </text>
            </g>
          );
        })}

        {xTicks.map(({ index, label }) => {
          const x = getX(index, pointCount);

          return (
            <g key={label}>
              <line
                className="stroke-border"
                strokeWidth="1"
                x1={x}
                x2={x}
                y1={chart.bottom}
                y2={chart.bottom + 7}
              />
              <text
                className="fill-muted-foreground text-[13px]"
                textAnchor="middle"
                x={x}
                y={chart.bottom + 29}
              >
                {label}
              </text>
            </g>
          );
        })}

        {series.map(({ color = "foreground", label, values }) => {
          const lastIndex = Math.max(0, values.length - 1);
          const lastValue = values.at(-1) ?? 0;
          const className = colorClasses[color];

          return (
            <g key={label}>
              <polyline
                className={className}
                fill="none"
                points={getPoints(values, pointCount, yMax)}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                className={className}
                cx={getX(lastIndex, pointCount)}
                cy={getY(lastValue, yMax)}
                fill="var(--background)"
                r="4"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              <text
                className={labelClasses[color]}
                fontSize="14"
                fontWeight="600"
                x={getX(lastIndex, pointCount) + 12}
                y={getY(lastValue, yMax) + 5}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      {caption ? (
        <figcaption className="mt-3 text-[0.82rem] leading-5 text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
};

export { Chart };

const chart = {
  bottom: 450,
  left: 58,
  right: 1110,
  top: 30,
};

const colorClasses = {
  accent: "stroke-accent",
  foreground: "stroke-foreground",
  muted: "stroke-muted-foreground",
};

const labelClasses = {
  accent: "fill-accent",
  foreground: "fill-foreground",
  muted: "fill-muted-foreground",
};

const getX = (index: number, pointCount: number) => {
  return (
    chart.left +
    (index / (pointCount - 1)) * (chart.right - chart.left)
  );
};

const getY = (value: number, yMax: number) => {
  return (
    chart.bottom -
    (value / yMax) * (chart.bottom - chart.top)
  );
};

const getPoints = (
  values: number[],
  pointCount: number,
  yMax: number,
) => {
  return values
    .map(
      (value, index) =>
        `${getX(index, pointCount)},${getY(value, yMax)}`,
    )
    .join(" ");
};

const getDefaultYTicks = (yMax: number) => {
  return Array.from({ length: 4 }, (_, index) =>
    Math.round((yMax / 3) * index),
  );
};
