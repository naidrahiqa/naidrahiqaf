import {
  getDriveId,
  getYouTubeId,
  getStoragePath,
  storagePublicUrl,
} from "@/lib/utils";
import type { VideoType } from "@/lib/types";

export function VideoEmbed({
  url,
  type,
  title,
}: {
  url: string | null;
  type: VideoType;
  title?: string;
}) {
  if (!url || type === "none") return null;

  if (type === "youtube") {
    const id = getYouTubeId(url);
    if (!id) return null;
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-black aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title ?? "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "drive") {
    const id = getDriveId(url);
    if (!id) return null;
    return (
      <div className="overflow-hidden rounded-xl border border-border bg-black aspect-video">
        <iframe
          className="h-full w-full"
          src={`https://drive.google.com/file/d/${id}/preview`}
          title={title ?? "Google Drive video"}
          allow="autoplay"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "storage") {
    const path = getStoragePath(url);
    if (!path) return null;
    return (
      <video
        className="aspect-video w-full rounded-xl border border-border bg-black"
        src={storagePublicUrl(path)}
        controls
        preload="metadata"
      />
    );
  }

  return null;
}
