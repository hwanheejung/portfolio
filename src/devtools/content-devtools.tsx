"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

import {
  getInitialValues,
  mdxComponentCatalog,
  type ComponentValues,
} from "./catalog";

const ContentDevTools = () => {
  const enabled = useSyncExternalStore(
    () => () => undefined,
    () => new URLSearchParams(window.location.search).has("dev"),
    () => false,
  );
  const [open, setOpen] = useState(true);
  const [selectedName, setSelectedName] = useState(
    mdxComponentCatalog[0]?.name ?? "",
  );
  const selected =
    mdxComponentCatalog.find((item) => item.name === selectedName) ??
    mdxComponentCatalog[0];
  const [values, setValues] = useState<ComponentValues>(() =>
    selected ? getInitialValues(selected) : {},
  );
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!selected) {
      return { error: "No MDX components are registered." };
    }

    try {
      return {
        preview: selected.renderPreview(values),
        snippet: selected.createSnippet(values),
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Could not render preview.",
      };
    }
  }, [selected, values]);

  if (!enabled || !selected) {
    return null;
  }

  const copySnippet = async () => {
    if (!result.snippet) {
      return;
    }

    await navigator.clipboard.writeText(result.snippet);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  if (!open) {
    return (
      <button
        className={cn(
          materialClasses,
          pressClasses,
          "fixed right-5 bottom-5 z-50 rounded-full px-4 py-2.5 text-xs font-semibold tracking-[0.02em] text-foreground transition-[transform,background-color] duration-220 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        MDX Tools
      </button>
    );
  }

  return (
    <aside
      aria-label="MDX component tools"
      className={cn(
        materialClasses,
        "fixed top-4 right-4 bottom-4 z-50 flex w-[min(25rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.75rem]",
      )}
    >
      <header className="flex items-center justify-between bg-[linear-gradient(180deg,rgb(255_255_255/0.025),transparent)] px-5 py-4 shadow-[0_1px_0_rgb(255_255_255/0.055)]">
        <div>
          <p className="text-[0.68rem] font-semibold tracking-[0.04em] text-muted-foreground">
            Content preview
          </p>
          <h2 className="mt-0.5 text-[1.05rem] font-semibold tracking-[-0.018em]">
            MDX Components
          </h2>
        </div>
        <Button
          aria-label="Close MDX tools"
          className="text-lg"
          onClick={() => setOpen(false)}
          size="icon"
          variant="ghost"
        >
          ×
        </Button>
      </header>

      <div className="px-3 py-3">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-black/18 p-1 shadow-[inset_0_1px_2px_rgb(0_0_0/0.16)]">
          {mdxComponentCatalog.map((item) => (
            <button
              aria-pressed={item.name === selected.name}
              className={cn(
                pressClasses,
                "shrink-0 rounded-lg px-3 py-1.5 text-[0.8rem] font-medium transition-[transform,color,background-color,box-shadow] duration-180 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                item.name === selected.name
                  ? "bg-white/11 text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_1px_4px_rgb(0_0_0/0.2)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
              key={item.name}
              onClick={() => {
                setSelectedName(item.name);
                setValues(getInitialValues(item));
                setCopied(false);
              }}
              type="button"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <section className="px-5 py-5">
          <h3 className="text-lg font-semibold tracking-[-0.018em]">
            {selected.name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {selected.description}
          </p>

          <div className="mt-5 space-y-4">
            {selected.fields
              .filter((field) => field.visibleWhen?.(values) ?? true)
              .map((field) => {
                const sharedProps = {
                  className: cn(
                    panelClasses,
                    "mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm text-foreground outline-none transition-[border-color,background-color,box-shadow] duration-160 focus:border-accent/65 focus:bg-[rgb(8_10_7/0.5)] focus:shadow-[0_0_0_3px_rgb(183_207_155/0.12),inset_0_1px_2px_rgb(0_0_0/0.12)]",
                  ),
                  id: `mdx-devtool-${field.key}`,
                  onChange: (
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
                    >,
                  ) =>
                    setValues((current) => ({
                      ...current,
                      [field.key]: event.target.value,
                    })),
                  value: values[field.key] ?? "",
                };

                return (
                  <label
                    className="block text-[0.82rem] font-medium"
                    htmlFor={sharedProps.id}
                    key={field.key}
                  >
                    {field.label}
                    {field.type === "textarea" ? (
                      <textarea
                        {...sharedProps}
                        className={`${sharedProps.className} min-h-28 resize-y`}
                      />
                    ) : field.type === "select" ? (
                      <select {...sharedProps}>
                        {field.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input {...sharedProps} type={field.type} />
                    )}
                    {field.description ? (
                      <span className="mt-1.5 block text-xs leading-5 font-normal text-muted-foreground">
                        {field.description}
                      </span>
                    ) : null}
                  </label>
                );
              })}
          </div>
        </section>

        <section className="px-5 py-5">
          <p className="text-[0.68rem] font-semibold tracking-[0.04em] text-muted-foreground">
            Preview
          </p>
          <div
            className={cn(
              panelClasses,
              "mt-3 overflow-hidden rounded-[1.35rem] p-4",
            )}
          >
            {result.error ? (
              <PreviewError message={result.error} />
            ) : (
              result.preview
            )}
          </div>
        </section>

        <section className="px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[0.68rem] font-semibold tracking-[0.04em] text-muted-foreground">
              MDX snippet
            </p>
            <Button
              disabled={!result.snippet}
              className={pressClasses}
              onClick={copySnippet}
              size="sm"
            >
              {copied ? "Copied" : "Copy MDX"}
            </Button>
          </div>
          <pre
            className={cn(
              panelClasses,
              "mt-3 overflow-x-auto rounded-[1.15rem] p-4 text-xs leading-6 text-foreground",
            )}
          >
            <code>{result.snippet ?? result.error}</code>
          </pre>
        </section>
      </div>
    </aside>
  );
};

export { ContentDevTools };

const PreviewError = ({ message }: { message: string }) => {
  return (
    <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {message}
    </div>
  );
};

const materialClasses =
  "border border-white/10 bg-[linear-gradient(145deg,rgb(255_255_255/0.05),transparent_36%),rgb(26_29_23/0.82)] shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_28px_90px_rgb(0_0_0/0.42)] backdrop-blur-[30px] backdrop-saturate-170 [@media(prefers-reduced-transparency:reduce)]:bg-card! [@media(prefers-reduced-transparency:reduce)]:[backdrop-filter:none]! contrast-more:border-[#76767e]! contrast-more:bg-background!";
const panelClasses =
  "border border-white/7.5 bg-[rgb(8_10_7/0.36)] shadow-[inset_0_1px_2px_rgb(0_0_0/0.12)]";
const pressClasses =
  "active:scale-[0.965] active:duration-80 motion-reduce:transform-none! motion-reduce:transition-colors motion-reduce:duration-120";
