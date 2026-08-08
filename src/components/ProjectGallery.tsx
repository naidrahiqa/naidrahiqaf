"use client";

import { useState } from "react";
import { ExternalLink, FileText, ImageOff } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ImageLightbox } from "@/components/ImageLightbox";
import type { ProjectMedia } from "@/lib/types";

function resolveMediaUrl(media: ProjectMedia): string {
  if (media.media_type === "image") return resolveImageUrl(media.url);
  return media.url;
}

function getSourceHref(url: string): string {
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) return url;
  if (url.startsWith("media/")) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    return `${base}/storage/v1/object/public/media/${url.replace(/^media\//, "")}`;
  }
  return url;
}

function isEmbeddableVideo(media: ProjectMedia): boolean {
  if (media.media_type === "youtube") return true;
  if (media.media_type === "storage") return true;
  if (media.media_type === "drive") {
    return /drive\.google\.com\/(file\/d\/|open\?id=)/.test(media.url);
  }
  return false;
}

function getDriveDocViewUrl(url: string): string {
  const match = url.match(/docs\.google\.com\/document\/d\/([^/]+)/);
  if (match) return `https://docs.google.com/document/d/${match[1]}/preview`;
  return url;
}

function LinkCard({ media }: { media: ProjectMedia }) {
  const href = getSourceHref(media.url);
  const isDoc = media.url.includes("docs.google.com");
  const previewUrl = isDoc ? getDriveDocViewUrl(media.url) : null;

  return (
    <figure className="rounded-xl border border-border bg-surface overflow-hidden">
      {previewUrl ? (
        <div className="aspect-video bg-surface-2">
          <iframe
            src={previewUrl}
            className="h-full w-full border-0"
            title={media.caption || "Document"}
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-surface-2 gap-2">
          <FileText size={24} className="text-muted" />
          <span className="text-xs font-semibold text-muted">Document</span>
        </div>
      )}
      <div className="flex items-center justify-between px-3 py-2">
        {media.caption && (
          <figcaption className="font-mono text-xs text-muted truncate">
            {media.caption}
          </figcaption>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-accent transition-colors hover:underline"
        >
          <ExternalLink size={11} />
          open
        </a>
      </div>
    </figure>
  );
}

function GalleryImage({
  img,
  onOpenLightbox,
}: {
  img: ProjectMedia;
  onOpenLightbox: (src: string, alt: string, href?: string) => void;
}) {
  const [error, setError] = useState(false);
  const src = resolveMediaUrl(img);
  const href = getSourceHref(img.url);

  if (error) {
    return (
      <figure className="overflow-hidden rounded-xl border border-border bg-surface">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex aspect-video items-center justify-center gap-2 bg-surface-2 text-muted transition-colors hover:text-accent"
        >
          <ImageOff size={20} />
          <span className="text-xs font-semibold">View image</span>
          <ExternalLink size={12} />
        </a>
        <div className="flex items-center justify-between px-3 py-2">
          {img.caption && (
            <figcaption className="font-mono text-xs text-muted">
              {img.caption}
            </figcaption>
          )}
        </div>
      </figure>
    );
  }

  return (
    <figure className="group overflow-hidden rounded-xl border border-border bg-surface">
      <button
        type="button"
        onClick={() => onOpenLightbox(src, img.caption || "project photo", href)}
        className="block w-full text-left"
      >
        <div className="aspect-video overflow-hidden bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={img.caption || "project photo"}
            loading="lazy"
            onError={() => setError(true)}
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
}

export function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  const images = media.filter((m) => m.media_type === "image");
  const embedVideos = media.filter((m) => m.media_type !== "image" && isEmbeddableVideo(m));
  const linkItems = media.filter((m) => m.media_type !== "image" && !isEmbeddableVideo(m));

  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    href?: string;
  } | null>(null);

  if (media.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((img) => (
            <GalleryImage
              key={img.id}
              img={img}
              onOpenLightbox={(src, alt, href) => setLightbox({ src, alt, href })}
            />
          ))}
        </div>
      )}

      {embedVideos.length > 0 && (
        <div className="flex flex-col gap-4">
          {embedVideos.map((video) => (
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

      {linkItems.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {linkItems.map((item) => (
            <LinkCard key={item.id} media={item} />
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