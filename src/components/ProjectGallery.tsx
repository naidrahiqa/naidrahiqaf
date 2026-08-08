import { resolveImageUrl } from "@/lib/utils";
import { VideoEmbed } from "@/components/VideoEmbed";
import type { ProjectMedia } from "@/lib/types";

function resolveMediaUrl(media: ProjectMedia): string {
  if (media.media_type === "image") return resolveImageUrl(media.url);
  return media.url;
}

export function ProjectGallery({ media }: { media: ProjectMedia[] }) {
  const images = media.filter((m) => m.media_type === "image");
  const videos = media.filter((m) => m.media_type !== "image");

  if (media.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((img) => (
            <figure
              key={img.id}
              className="group overflow-hidden rounded-xl border border-border bg-surface"
            >
              <div className="aspect-video overflow-hidden bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(img)}
                  alt={img.caption || "project photo"}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {img.caption && (
                <figcaption className="px-3 py-2 font-mono text-xs text-muted">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
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
    </div>
  );
}
