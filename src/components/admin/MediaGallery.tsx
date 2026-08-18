"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2, Play, FileText } from "lucide-react";
import type { ProjectMediaType } from "@/lib/types";
import { cn, resolveImageUrl, detectVideoType } from "@/lib/utils";
import { Input, Label, Select } from "@/components/admin/ui";
import { FileUpload } from "@/components/admin/FileUpload";

export interface MediaDraft {
  media_type: ProjectMediaType;
  url: string;
  caption: string;
}

const typeOptions: { value: ProjectMediaType; label: string; hint: string }[] = [
  { value: "image", label: "Image", hint: "Photo or screenshot" },
  { value: "youtube", label: "YouTube", hint: "youtube.com or youtu.be" },
  { value: "drive", label: "Google Drive", hint: "drive.google.com/file/d/..." },
  { value: "storage", label: "Storage Video", hint: "MP4 upload to Supabase Storage" },
];

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
  return m ? m[1] : null;
}

function getDriveId(url: string): string | null {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m) return m[1];
  const m2 = url.match(/[?&]id=([^&]+)/);
  if (m2 && url.includes("drive.google.com")) return m2[1];
  return null;
}

function VideoPreview({ url, type }: { url: string; type: string }) {
  if (type === "youtube") {
    const id = getYouTubeId(url);
    if (!id) return null;
    return (
      <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
        <Image
          src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
          alt="YouTube preview"
          width={320}
          height={180}
          className="w-full object-cover"
        />
      </div>
    );
  }

  if (type === "drive") {
    const id = getDriveId(url);
    if (!id) return null;
    return (
      <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
        <Image
          src={`https://lh3.googleusercontent.com/d/${id}=w400`}
          alt="Drive preview"
          width={400}
          height={300}
          className="w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  return null;
}

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
        <p className="text-xs text-muted">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
        <button
          type="button"
          onClick={addImage}
          className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border bg-surface-2 px-3 py-1.5 text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
        >
          <Plus size={12} />
          Add Item
        </button>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">
          No media yet — add photos or videos to showcase
        </p>
      )}

      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-surface-2 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-[11px] font-medium text-muted">
                  #{index + 1}
                </p>
                {item.media_type === "image" && <ImagePlus size={12} className="text-muted" />}
                {(item.media_type === "youtube" || item.media_type === "drive" || item.media_type === "storage") && (
                  <Play size={12} className="text-muted" />
                )}
              </div>
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
                <Label htmlFor={`media-type-${index}`}>Type</Label>
                <Select
                  id={`media-type-${index}`}
                  value={item.media_type}
                  onChange={(e) => {
                    const newType = e.target.value as ProjectMediaType;
                    const patch: Partial<MediaDraft> = { media_type: newType };
                    // Don't clear URL if switching between image types or if URL looks like the new type
                    if (item.url) {
                      const detected = detectVideoType(item.url);
                      if (newType === "image" && !detected) {
                        // Keep URL — might be an image
                      } else if (newType !== "image" && detected && detected === newType) {
                        // Keep URL — it matches
                      } else if (newType === "image" && item.media_type !== "image") {
                        // Keep URL — user might paste an image URL
                      } else {
                        patch.url = "";
                      }
                    }
                    update(index, patch);
                  }}
                >
                  {typeOptions.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
                <p className="mt-0.5 text-[10px] text-muted">
                  {typeOptions.find((t) => t.value === item.media_type)?.hint}
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor={`media-url-${index}`}>
                  {item.media_type === "image"
                    ? "Image URL (or upload below)"
                    : item.media_type === "storage"
                      ? "Video File"
                      : "Video URL"}
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
              <Label htmlFor={`media-caption-${index}`}>Caption</Label>
              <Input
                id={`media-caption-${index}`}
                value={item.caption}
                onChange={(e) => update(index, { caption: e.target.value })}
                placeholder="Optional — shown below the media"
              />
            </div>

            {/* Image preview */}
            {item.media_type === "image" && item.url && (
              <div className="mt-3 overflow-hidden rounded-lg border border-border bg-background">
                <Image
                  src={resolveImageUrl(item.url)}
                  alt="preview"
                  width={800}
                  height={400}
                  className={cn("max-h-40 w-full object-contain")}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Video preview */}
            {item.media_type !== "image" && item.url && (
              <VideoPreview url={item.url} type={item.media_type} />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addImage}
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-border bg-surface-2 px-3 py-2 text-[11px] text-muted transition-colors hover:border-accent/50 hover:text-accent"
      >
        <ImagePlus size={13} />
        Add Media Item
      </button>
    </div>
  );
}