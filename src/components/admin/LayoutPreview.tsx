"use client";

import type { ProjectLayout } from "@/lib/types";

const LAYOUTS: {
  value: ProjectLayout;
  label: string;
  hint: string;
  render: () => React.ReactNode;
}[] = [
  {
    value: "video-focus",
    label: "Video Focus",
    hint: "Video besar di atas, gallery & teks di bawah",
    render: () => (
      <div className="flex flex-col gap-1">
        <div className="h-8 w-full rounded bg-info/30" />
        <div className="flex gap-1">
          <div className="h-4 w-1/3 rounded bg-accent/25" />
          <div className="h-4 w-1/3 rounded bg-accent/25" />
          <div className="h-4 w-1/3 rounded bg-accent/25" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-full rounded bg-muted/20" />
          <div className="h-1 w-3/4 rounded bg-muted/20" />
          <div className="h-1 w-5/6 rounded bg-muted/20" />
        </div>
      </div>
    ),
  },
  {
    value: "gallery-first",
    label: "Gallery First",
    hint: "Grid media besar, teks di bawah",
    render: () => (
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-2 gap-1">
          <div className="h-6 rounded bg-accent/25" />
          <div className="h-6 rounded bg-accent/25" />
          <div className="h-6 rounded bg-accent/25" />
          <div className="h-6 rounded bg-accent/25" />
        </div>
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-full rounded bg-muted/20" />
          <div className="h-1 w-3/4 rounded bg-muted/20" />
        </div>
      </div>
    ),
  },
  {
    value: "text-first",
    label: "Text First",
    hint: "Konten markdown dulu, gallery di bawah",
    render: () => (
      <div className="flex flex-col gap-1">
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-full rounded bg-muted/20" />
          <div className="h-1 w-4/5 rounded bg-muted/20" />
          <div className="h-1 w-3/4 rounded bg-muted/20" />
          <div className="h-1 w-5/6 rounded bg-muted/20" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 flex-1 rounded bg-accent/25" />
          <div className="h-5 flex-1 rounded bg-accent/25" />
          <div className="h-5 flex-1 rounded bg-accent/25" />
        </div>
      </div>
    ),
  },
  {
    value: "cover-hero",
    label: "Cover Hero",
    hint: "Gambar sampul penuh di hero",
    render: () => (
      <div className="flex flex-col gap-1">
        <div className="h-10 w-full rounded bg-accent/25" />
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-full rounded bg-muted/20" />
          <div className="h-1 w-3/4 rounded bg-muted/20" />
          <div className="h-1 w-2/3 rounded bg-muted/20" />
        </div>
      </div>
    ),
  },
  {
    value: "masonry",
    label: "Masonry",
    hint: "Kolom foto bebas tinggi, teks minimal",
    render: () => (
      <div className="flex gap-1">
        <div className="flex flex-col gap-1">
          <div className="h-6 w-4 rounded bg-accent/25" />
          <div className="h-10 w-4 rounded bg-accent/25" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-8 w-4 rounded bg-accent/25" />
          <div className="h-5 w-4 rounded bg-accent/25" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="h-4 w-4 rounded bg-accent/25" />
          <div className="h-11 w-4 rounded bg-accent/25" />
        </div>
        <div className="flex-1 flex flex-col gap-0.5 pt-1">
          <div className="h-1 w-full rounded bg-muted/20" />
          <div className="h-1 w-3/4 rounded bg-muted/20" />
          <div className="h-1 w-5/6 rounded bg-muted/20" />
        </div>
      </div>
    ),
  },
];

export function LayoutPreview({ value }: { value: ProjectLayout }) {
  const layout = LAYOUTS.find((l) => l.value === value) ?? LAYOUTS[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg border border-border bg-surface p-3">
        {layout.render()}
      </div>
      <p className="text-xs text-muted">{layout.hint}</p>
    </div>
  );
}