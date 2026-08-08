"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import { MarkdownContent } from "@/components/MarkdownContent";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ImageLightbox } from "@/components/ImageLightbox";
import type { Project, ProjectMedia } from "@/lib/types";

function getSourceHref(url: string): string {
  if (url.includes("drive.google.com") || url.includes("docs.google.com")) return url;
  if (url.startsWith("media/")) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    return `${base}/storage/v1/object/public/media/${url.replace(/^media\//, "")}`;
  }
  return url;
}

function MasonryGallery({ media }: { media: ProjectMedia[] }) {
  const images = media.filter((m) => m.media_type === "image");
  const videos = media.filter((m) => m.media_type !== "image");
  if (images.length === 0 && videos.length === 0) return null;

  const [lightbox, setLightbox] = useState<{
    src: string;
    alt: string;
    href?: string;
  } | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {images.length > 0 && (
        <div className="columns-2 gap-4 md:columns-3">
          {images.map((img) => {
            const src = resolveImageUrl(img.url);
            const href = getSourceHref(img.url);
            return (
              <figure
                key={img.id}
                className="group mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface"
              >
                <button
                  type="button"
                  onClick={() => setLightbox({ src, alt: img.caption || "project photo", href })}
                  className="block w-full text-left"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={img.caption || "project photo"}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
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
            <VideoEmbed
              key={video.id}
              url={video.url}
              type={video.media_type as "youtube" | "drive" | "storage"}
              title={video.caption}
            />
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

export function ProjectLayout({
  project,
  media,
}: {
  project: Project;
  media: ProjectMedia[];
}) {
  const cover = resolveImageUrl(project.cover_image);
  const coverHref = getSourceHref(project.cover_image ?? "");
  const markdown = project.content ? (
    <MarkdownContent content={project.content} />
  ) : null;
  const video = project.video_url && project.video_type !== "none" ? (
    <VideoEmbed
      url={project.video_url}
      type={project.video_type}
      title={project.title}
    />
  ) : null;

  const [coverLightbox, setCoverLightbox] = useState(false);

  switch (project.layout) {
    case "text-first":
      return (
        <div className="flex flex-col gap-8">
          {markdown}
          <ProjectGallery media={media} />
          {video}
        </div>
      );
    case "gallery-first":
      return (
        <div className="flex flex-col gap-8">
          <ProjectGallery media={media} />
          {markdown}
          {video}
        </div>
      );
    case "cover-hero":
      return (
        <div className="flex flex-col gap-8">
          {cover && (
            <div className="overflow-hidden rounded-2xl border-2 border-foreground bg-surface hard-shadow-sm">
              <button
                type="button"
                onClick={() => setCoverLightbox(true)}
                className="block w-full text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover}
                  alt={project.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              </button>
            </div>
          )}
          {coverLightbox && cover && (
            <ImageLightbox
              src={cover}
              alt={project.title}
              href={coverHref || undefined}
              onClose={() => setCoverLightbox(false)}
            />
          )}
          <ProjectGallery media={media} />
          {video}
          {markdown}
        </div>
      );
    case "masonry":
      return (
        <div className="flex flex-col gap-8">
          {markdown}
          <MasonryGallery media={media} />
          {video}
        </div>
      );
    case "video-focus":
    default:
      return (
        <div className="flex flex-col gap-8">
          {video}
          <ProjectGallery media={media} />
          {markdown}
        </div>
      );
  }
}