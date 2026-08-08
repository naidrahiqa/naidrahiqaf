import { resolveImageUrl } from "@/lib/utils";
import { MarkdownContent } from "@/components/MarkdownContent";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ProjectGallery } from "@/components/ProjectGallery";
import type { Project, ProjectMedia } from "@/lib/types";

function MasonryGallery({ media }: { media: ProjectMedia[] }) {
  const images = media.filter((m) => m.media_type === "image");
  const videos = media.filter((m) => m.media_type !== "image");
  if (images.length === 0 && videos.length === 0) return null;

  return (
    <div className="flex flex-col gap-8">
      {images.length > 0 && (
        <div className="columns-2 gap-4 md:columns-3">
          {images.map((img) => (
            <figure
              key={img.id}
              className="mb-4 break-inside-avoid overflow-hidden rounded-xl border border-border bg-surface"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageUrl(img.url)}
                alt={img.caption || "project photo"}
                loading="lazy"
                className="w-full object-cover"
              />
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
            <VideoEmbed
              key={video.id}
              url={video.url}
              type={video.media_type as "youtube" | "drive" | "storage"}
              title={video.caption}
            />
          ))}
        </div>
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover}
                alt={project.title}
                className="aspect-[16/9] w-full object-cover"
              />
            </div>
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