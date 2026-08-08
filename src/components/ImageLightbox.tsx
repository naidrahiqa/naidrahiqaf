"use client";

import { useCallback, useEffect, useRef } from "react";
import { X, ExternalLink } from "lucide-react";

interface LightboxProps {
  src: string;
  alt: string;
  href?: string;
  onClose: () => void;
}

export function ImageLightbox({ src, alt, href, onClose }: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) close();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <button
        onClick={close}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X size={20} />
      </button>

      <div className="relative flex max-h-[85vh] max-w-[90vw] flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-full rounded-lg object-contain"
        />
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            <ExternalLink size={13} />
            Open original
          </a>
        )}
      </div>
    </div>
  );
}