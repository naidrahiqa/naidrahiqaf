export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export const CLASS_LEVELS = ["x", "xi", "xii"] as const;

export function classLabel(value: string): string {
  return value.toUpperCase();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/
  );
  return match ? match[1] : null;
}

export function getDriveId(url: string): string | null {
  const match = url.match(
    /(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/file\/d\/)([\w-]{20,})/
  );
  return match ? match[1] : null;
}

export function getStoragePath(url: string): string | null {
  if (url.startsWith("http")) {
    const match = url.match(/\/storage\/v1\/object\/public\/media\/(.+)$/);
    return match ? match[1] : null;
  }
  // Bare filename or media/... path
  return url;
}

export function storagePublicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base}/storage/v1/object/public/media/${path.replace(/^media\//, "")}`;
}

export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) {
    const driveId = getDriveId(url);
    if (driveId && (url.includes("drive.google.com") || url.includes("docs.google.com")))
      return `https://lh3.googleusercontent.com/d/${driveId}=s0`;
    return url;
  }
  // Bare filename or media/... path → Supabase Storage URL
  return storagePublicUrl(url);
}

export function detectVideoType(
  url: string | null | undefined
): "none" | "youtube" | "drive" | "storage" {
  if (!url) return "none";
  if (getYouTubeId(url)) return "youtube";
  if (getDriveId(url)) return "drive";
  if (url.startsWith("http") && url.includes("/storage/v1/object/public/media/")) return "storage";
  if (url.startsWith("media/")) return "storage";
  return "none";
}
