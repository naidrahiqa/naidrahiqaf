export type VideoType = "none" | "youtube" | "drive" | "storage";

export interface Profile {
  id: number;
  name: string;
  nickname: string;
  tagline: string;
  hero_description: string;
  profile_image: string | null;
  updated_at: string;
}

export interface AboutSection {
  id: string;
  key: string;
  heading: string;
  content: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  platform: string;
  handle: string;
  url: string;
  sort_order: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  video_url: string | null;
  video_type: VideoType;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export type ProjectCategory = "school" | "personal";

export type ProjectLayout =
  | "text-first"
  | "gallery-first"
  | "cover-hero"
  | "masonry"
  | "video-focus";

export const PROJECT_LAYOUTS: ProjectLayout[] = [
  "text-first",
  "gallery-first",
  "cover-hero",
  "masonry",
  "video-focus",
];

export type ProjectMediaType = "image" | "youtube" | "drive" | "storage";

export interface ProjectMedia {
  id: string;
  project_id: string;
  media_type: ProjectMediaType;
  url: string;
  caption: string;
  sort_order: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  layout: ProjectLayout;
  class_level: string;
  subject: string;
  description: string;
  content: string;
  cover_image: string | null;
  video_url: string | null;
  video_type: VideoType;
  link: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type AchievementCategory = "competition" | "training" | "seminar";

export interface NowPlayingSong {
  id: string;
  title: string;
  artist: string;
  album: string;
  art_url: string;
  link: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  event: string;
  category: AchievementCategory;
  year: string;
  description: string;
  certificate_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PostInsert {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_image?: string | null;
  video_url?: string | null;
  video_type?: VideoType;
  published?: boolean;
}

export interface ProjectInsert {
  title: string;
  slug: string;
  category: ProjectCategory;
  layout?: ProjectLayout;
  class_level?: string;
  subject?: string;
  description?: string;
  content?: string;
  cover_image?: string | null;
  video_url?: string | null;
  video_type?: VideoType;
  link?: string | null;
  published?: boolean;
  featured?: boolean;
  sort_order?: number;
}

export interface ProjectMediaInsert {
  media_type: ProjectMediaType;
  url: string;
  caption?: string;
  sort_order?: number;
}

export interface AchievementInsert {
  title: string;
  event?: string;
  category?: AchievementCategory;
  year?: string;
  description?: string;
  certificate_url?: string | null;
  sort_order?: number;
}
