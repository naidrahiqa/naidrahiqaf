"use client";

import { useState } from "react";
import { UploadCloud, X, Link as LinkIcon, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function convertGoogleDriveUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
  if (match) return `https://lh3.googleusercontent.com/d/${match[1]}`;
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2 && url.includes("drive.google.com")) return `https://lh3.googleusercontent.com/d/${match2[1]}`;
  return url;
}

function isGoogleDriveUrl(url: string): boolean {
  return url.includes("drive.google.com") || url.includes("lh3.googleusercontent.com/d/");
}

function isImageUrl(url: string): boolean {
  if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)) return true;
  if (isGoogleDriveUrl(url)) return true;
  return false;
}

function getPreviewUrl(value: string): string {
  if (value.startsWith("http")) return value;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${value}`;
}

export function FileUpload({
  label,
  value,
  onChange,
  accept = "image/*,video/mp4,application/pdf",
}: {
  label: string;
  value: string | null;
  onChange: (path: string | null) => void;
  accept?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `media/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;
      onChange(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleUrlSubmit() {
    if (!urlInput.trim()) return;
    const url = convertGoogleDriveUrl(urlInput.trim());
    onChange(url);
    setUrlInput("");
  }

  return (
    <div>
      <p className="mb-1.5 font-mono text-xs text-muted">{label}</p>

      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
            mode === "upload"
              ? "bg-accent text-on-accent"
              : "border border-border bg-surface-2 text-muted hover:border-accent/50"
          }`}
        >
          <UploadCloud size={13} />
          Upload File
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
            mode === "url"
              ? "bg-accent text-on-accent"
              : "border border-border bg-surface-2 text-muted hover:border-accent/50"
          }`}
        >
          <LinkIcon size={13} />
          Paste URL
        </button>
      </div>

      {mode === "upload" ? (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent">
          <UploadCloud size={15} />
          {uploading ? "uploading..." : "upload file"}
          <input
            type="file"
            className="hidden"
            accept={accept}
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
            placeholder="Paste Google Drive link or image URL..."
            className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm text-on-accent transition-colors hover:opacity-90 disabled:opacity-40"
          >
            <Check size={14} />
            Add
          </button>
        </div>
      )}

      {value && (
        <div className="mt-2 flex items-center gap-2">
          {isImageUrl(value) ? (
            <img
              src={getPreviewUrl(value)}
              alt="Preview"
              className="h-16 w-16 rounded-lg border border-border object-cover"
            />
          ) : (
            <span className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted">
              {value.includes("drive.google.com") ? "Google Drive file" : value.split("/").pop()}
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-danger hover:text-danger/80"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
