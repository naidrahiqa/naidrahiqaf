"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import type { ProjectMediaType } from "@/lib/types";
import { cn, resolveImageUrl } from "@/lib/utils";
import { Input, Label, Select } from "@/components/admin/ui";
import { FileUpload } from "@/components/admin/FileUpload";

export interface MediaDraft {
  media_type: ProjectMediaType;
  url: string;
  caption: string;
}

const typeOptions: { value: ProjectMediaType; label: string }[] = [
  { value: "image", label: "image" },
  { value: "youtube", label: "youtube" },
  { value: "drive", label: "google drive" },
  { value: "storage", label: "storage video" },
];

export function MediaGallery({
  items,
  onChange,
}: {
  items: MediaDraft[];
  onChange: (items: MediaDraft[]) => void;
}) {
  const [error, setError] = useState<string | null>(null);

  function update(index: number, patch: Partial<MediaDraft>) {
    setError(null);
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addImage() {
    onChange([...items, { media_type: "image", url: "", caption: "" }]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-muted">
          media gallery — photos & videos showcase
        </p>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-surface-2 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <Plus size={12} />
          add item
        </button>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-4 text-center font-mono text-xs text-muted">
          no media yet — add photos or videos
        </p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-surface-2 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="font-mono text-[11px] text-muted">
                #{index + 1}
              </p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="rounded-md border border-border p-1.5 text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-30"
                  aria-label="Move up"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded-md border border-border p-1.5 text-muted transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-30"
                  aria-label="Move down"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="rounded-md border border-danger/40 p-1.5 text-danger transition-colors hover:bg-danger/10"
                  aria-label="Remove item"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <Label htmlFor={`media-type-${index}`}>type</Label>
                <Select
                  id={`media-type-${index}`}
                  value={item.media_type}
                  onChange={(e) =>
                    update(index, {
                      media_type: e.target.value as ProjectMediaType,
                      url: "",
                    })
                  }
                >
                  {typeOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor={`media-url-${index}`}>
                  {item.media_type === "image"
                    ? "image url (or upload)"
                    : item.media_type === "storage"
                      ? "video file (upload)"
                      : "video url"}
                </Label>
                {item.media_type === "image" || item.media_type === "storage" ? (
                  <FileUpload
                    label=""
                    value={item.url || null}
                    onChange={(path) => update(index, { url: path ?? "" })}
                    accept={
                      item.media_type === "image"
                        ? "image/*"
                        : "video/mp4,video/webm,video/ogg"
                    }
                  />
                ) : (
                  <Input
                    id={`media-url-${index}`}
                    value={item.url}
                    onChange={(e) => update(index, { url: e.target.value })}
                    placeholder={
                      item.media_type === "youtube"
                        ? "https://youtube.com/watch?v=..."
                        : "https://drive.google.com/file/d/..."
                    }
                  />
                )}
              </div>
            </div>

            <div className="mt-3">
              <Label htmlFor={`media-caption-${index}`}>caption</Label>
              <Input
                id={`media-caption-${index}`}
                value={item.caption}
                onChange={(e) => update(index, { caption: e.target.value })}
                placeholder="optional caption"
              />
            </div>

            {item.media_type === "image" && item.url && (
              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(item.url)}
                  alt="preview"
                  className={cn("max-h-40 w-full object-contain")}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border bg-surface-2 px-3 py-2 font-mono text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        <ImagePlus size={13} />
        add media item
      </button>
    </div>
  );
}
