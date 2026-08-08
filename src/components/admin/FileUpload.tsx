"use client";

import { useState } from "react";
import { UploadCloud, X, Link as LinkIcon, Check, FileVideo, Image } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function convertGoogleDriveUrl(url: string): string {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
  if (match) return `https://lh3.googleusercontent.com/d/${match[1]}=s0`;
  const match2 = url.match(/docs\.google\.com\/(?:document|file)\/d\/([^/]+)/);
  if (match2) return `https://lh3.googleusercontent.com/d/${match2[1]}=s0`;
  const match3 = url.match(/[?&]id=([^&]+)/);
  if (match3 && (url.includes("drive.google.com") || url.includes("docs.google.com")))
    return `https://lh3.googleusercontent.com/d/${match3[1]}=s0`;
  return url;
}

function getGoogleDriveFileId(url: string): string | null {
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)\//);
  if (match) return match[1];
  const match2 = url.match(/[?&]id=([^&]+)/);
  if (match2 && url.includes("drive.google.com")) return match2[1];
  return null;
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
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/media/${value.replace(/^media\//, "")}`;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MIME_ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
]);

function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return `File too large (max 10MB) — ${(file.size / 1024 / 1024).toFixed(1)}MB`;
  }
  if (!MIME_ALLOWED.has(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}`;
  }
  return null;
}

function formatAcceptHint(accept: string): string {
  if (accept.includes("video")) return "MP4, WebM, OGG (max 10MB)";
  if (accept.includes("pdf")) return "Images or PDF (max 10MB)";
  return "JPG, PNG, WebP, GIF (max 10MB)";
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
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${Date.now()}-${safeName}`;
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
      {label && <p className="mb-1.5 text-xs font-medium text-foreground">{label}</p>}

      <div className="mb-2 flex gap-2">
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

      <p className="mb-2 text-[10px] text-muted">
        {formatAcceptHint(accept)}
      </p>

      {mode === "upload" ? (
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-surface-2 px-4 py-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-accent">
          <UploadCloud size={15} />
          {uploading ? "Uploading..." : "Choose file or drag here"}
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
            <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs text-muted">
              {value.includes("drive.google.com") ? (
                <><FileVideo size={12} /> Google Drive file</>
              ) : (
                <><Image size={12} /> {value.split("/").pop()}</>
              )}
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