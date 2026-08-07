"use client";

import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

  return (
    <div>
      <p className="mb-1.5 font-mono text-xs text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
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
        {value && (
          <span className="flex items-center gap-2 font-mono text-xs text-muted">
            <span className="truncate max-w-[200px]">{value}</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-danger hover:text-danger/80"
              aria-label="Remove file"
            >
              <X size={14} />
            </button>
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
