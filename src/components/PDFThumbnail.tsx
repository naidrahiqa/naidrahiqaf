"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, ExternalLink } from "lucide-react";

interface PDFThumbnailProps {
  url: string;
  className?: string;
}

function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function PDFThumbnail({ url, className = "" }: PDFThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const loadingTask = pdfjs.getDocument({
          url,
          // For external URLs, disable range requests which can cause CORS issues
          disableAutoFetch: isExternalUrl(url),
          disableRange: isExternalUrl(url),
        });
        const doc = await loadingTask.promise;
        const page = await doc.getPage(1);
        const viewport = page.getViewport({ scale: 0.5 });

        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const renderTask = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        } as any);
        await renderTask.promise;
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 bg-surface-2 text-muted transition-colors hover:text-accent ${className}`}
      >
        <FileText size={20} />
        <span className="text-xs">View PDF</span>
        <ExternalLink size={12} />
      </a>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`object-cover ${loading ? "opacity-0" : ""}`}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
