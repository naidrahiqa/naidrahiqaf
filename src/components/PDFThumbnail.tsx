"use client";

import { useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";

interface PDFThumbnailProps {
  url: string;
  className?: string;
}

export function PDFThumbnail({ url, className = "" }: PDFThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

        const doc = await pdfjs.getDocument({ url }).promise;
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
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [url]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-surface-2 ${className}`}>
        <FileText size={24} className="text-muted" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`object-cover ${className}`}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
