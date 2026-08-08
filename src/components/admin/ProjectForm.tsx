"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wand2 } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { Project, ProjectMedia, ProjectLayout } from "@/lib/types";
import {
  Button,
  Card,
  Input,
  Label,
  StatusPill,
  Select,
  TextArea,
} from "@/components/admin/ui";
import { FileUpload } from "@/components/admin/FileUpload";
import { VideoFields } from "@/components/admin/VideoFields";
import { MediaGallery, type MediaDraft } from "@/components/admin/MediaGallery";
import { LayoutPreview } from "@/components/admin/LayoutPreview";

const classLevels = ["", "x", "xi", "xii"];

const layoutOptions: { value: ProjectLayout; label: string }[] = [
  { value: "video-focus", label: "video focus" },
  { value: "gallery-first", label: "gallery first" },
  { value: "text-first", label: "text first" },
  { value: "cover-hero", label: "cover hero" },
  { value: "masonry", label: "masonry" },
];

export function ProjectForm({ initial }: { initial?: Project | null }) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState<"school" | "personal">(
    initial?.category ?? "school"
  );
  const [layout, setLayout] = useState<ProjectLayout>(
    initial?.layout ?? "video-focus"
  );
  const [classLevel, setClassLevel] = useState(initial?.class_level ?? "");
  const [subject, setSubject] = useState(initial?.subject ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(
    initial?.cover_image ?? null
  );
  const [videoUrl, setVideoUrl] = useState<string | null>(
    initial?.video_url ?? null
  );
  const [videoType, setVideoType] = useState<string>(
    initial?.video_type ?? "none"
  );
  const [link, setLink] = useState(initial?.link ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [media, setMedia] = useState<MediaDraft[]>([]);
  const [mediaLoaded, setMediaLoaded] = useState(!initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    fetch(`/api/admin/projects/${initial.id}/media`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load media");
        return r.json();
      })
      .then((data: ProjectMedia[]) => {
        if (Array.isArray(data)) {
          setMedia(
            data.map((m) => ({
              media_type: m.media_type,
              url: m.url,
              caption: m.caption,
            }))
          );
        }
        setMediaLoaded(true);
      })
      .catch(() => {
        setError("Failed to load existing media. Save without changing media to avoid data loss.");
      });
  }, [initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isEdit && !mediaLoaded) {
      setError("Media not loaded yet. Wait for it to load before saving.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      title,
      slug,
      category,
      layout,
      class_level: category === "school" ? classLevel : "",
      subject: category === "school" ? subject : "",
      description,
      content,
      cover_image: coverImage,
      video_url: videoUrl,
      video_type: videoType,
      link: link || null,
      published,
      featured,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/projects/${initial!.id}` : "/api/admin/projects",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      const projectId = isEdit ? initial!.id : data.id;

      const mediaRes = await fetch(`/api/admin/projects/${projectId}/media`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: media }),
      });
      if (!mediaRes.ok) {
        const mdata = await mediaRes.json().catch(() => ({}));
        throw new Error(mdata.error ?? "Failed to save media");
      }

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">title *</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!isEdit || !slug) setSlug(slugify(e.target.value));
            }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="slug">slug</Label>
            <button
              type="button"
              onClick={() => setSlug(slugify(title))}
              className="mb-1.5 inline-flex items-center gap-1 font-mono text-[11px] text-accent transition-colors hover:underline"
            >
              <Wand2 size={11} />
              generate from title
            </button>
          </div>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-project-slug"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="layout">detail layout</Label>
            <Select
              id="layout"
              value={layout}
              onChange={(e) => setLayout(e.target.value as ProjectLayout)}
            >
              {layoutOptions.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </Select>
            <div className="mt-2">
              <LayoutPreview value={layout} />
            </div>
          </div>
          <div>
            <Label htmlFor="category">category</Label>
            <Select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "school" | "personal")
              }
            >
              <option value="school">school</option>
              <option value="personal">personal</option>
            </Select>
          </div>
          {category === "school" ? (
            <div>
              <Label htmlFor="class_level">class level</Label>
              <Select
                id="class_level"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
              >
                {classLevels.map((c) => (
                  <option key={c} value={c}>
                    {c === "" ? "— none —" : `Kelas ${c.toUpperCase()}`}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
        </div>

        {category === "school" && (
          <div>
            <Label htmlFor="subject">subject (mapel)</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Produktif TKJ, Matematika, PAI..."
            />
            <p className="mt-1.5 font-mono text-[11px] text-muted">
              Showcase yang subject-nya sama akan dikelompokkan di halaman
              mapel ini.
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="description">description</Label>
          <TextArea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary shown on cards"
          />
        </div>

        <div>
          <Label htmlFor="content">content (markdown)</Label>
          <TextArea
            id="content"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Project details in markdown..."
          />
        </div>

        <FileUpload
          label="cover image"
          value={coverImage}
          onChange={setCoverImage}
          accept="image/*"
        />

        <VideoFields
          url={videoUrl}
          type={videoType}
          onChange={(f) => {
            setVideoUrl(f.video_url);
            setVideoType(f.video_type);
          }}
        />

        <MediaGallery items={media} onChange={setMedia} />

        <div>
          <Label htmlFor="link">external link</Label>
          <Input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://github.com/naidrahiqa/..."
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex w-fit cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="h-4 w-4 accent-emerald-400"
            />
            <StatusPill ok={published} text={published ? "published" : "hidden"} />
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            <StatusPill ok={featured} text={featured ? "featured" : "not featured"} />
          </label>
        </div>
      </Card>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "saving..." : isEdit ? "Save changes" : "Create project"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/projects")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
