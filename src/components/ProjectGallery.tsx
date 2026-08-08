"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ImageLightbox } from "@/components/ImageLightbox";
import type { ProjectMedia } from "@/lib/types";

function resolveMediaUrl(media: ProjectMedia): string {
  if (media.media_type === "image") return resolveImageUrl(media.url);
  return media.url;
}

function getSourceHref(url: string): string {
  if (url.includes("drive.google.com")) return url;
  if (url.startsWith("media/")) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    return `${base}/storage/v1/object/public/media/${url.replace(/^media\//, "")}`;
  }
  return url;
}

export function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  const images = media.filter((m) => m.media_type === "image");
  const videos = media.filter((m) => m.media_type !== "image");

  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    href?: string;
  } | null>(null);

  if (media.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((img) => {
            const src = resolveMediaUrl(img);
            const href = getSourceHref(img.url);
            return (
              <figure
                key={img.id}
                className="group overflow-hidden rounded-xl border border-border bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setLightbox({ src, alt: img.caption || "project photo", href })}
                  className="block w-full text-left"
                >
                  <div className="aspect-video overflow-hidden bg-surface-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={img.caption || "project photo"}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </button>
                <div className="flex items-center justify-between px-3 py-2">
                  {img.caption && (
                    <figcaption className="font-mono text-xs text-muted">
                      {img.caption}
                    </figcaption>
                  )}
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-accent transition-colors hover:underline"
                  >
                    <ExternalLink size={11} />
                    source
                  </a>
                </div>
              </figure>
            );
          })}
        </div>
      )}

      {videos.length > 0 && (
        <div className="flex flex-col gap-4">
          {videos.map((video) => (
            <figure key={video.id}>
              <VideoEmbed
                url={video.url}
                type={video.media_type as "youtube" | "drive" | "storage"}
                title={video.caption}
              />
              {video.caption && (
                <figcaption className="mt-2 text-center font-mono text-xs text-muted">
                  {video.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          href={lightbox.href}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}