export const postFields = [
  "title",
  "slug",
  "excerpt",
  "content",
  "cover_image",
  "video_url",
  "video_type",
  "published",
] as const;

export const projectFields = [
  "title",
  "slug",
  "category",
  "layout",
  "class_level",
  "subject",
  "description",
  "content",
  "cover_image",
  "video_url",
  "video_type",
  "link",
  "published",
  "featured",
  "sort_order",
] as const;

export const achievementFields = [
  "title",
  "event",
  "category",
  "year",
  "description",
  "certificate_url",
  "sort_order",
] as const;

export const nowPlayingFields = [
  "title",
  "artist",
  "album",
  "art_url",
  "link",
  "sort_order",
] as const;

export const profileFields = [
  "name",
  "nickname",
  "tagline",
  "hero_description",
  "profile_image",
] as const;

export const aboutFields = ["key", "heading", "content", "sort_order"] as const;

export type FieldWhitelist = readonly string[];

export function pickFields(
  source: Record<string, unknown>,
  allowed: readonly string[]
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of allowed) {
    if (source[key] !== undefined) out[key] = source[key];
  }
  return out;
}