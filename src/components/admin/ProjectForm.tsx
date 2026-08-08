"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Wand2, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
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
import { useToast } from "@/components/admin/Toast";

const classLevels = ["", "x", "xi", "xii"];

const layoutOptions: { value: ProjectLayout; label: string; hint: string }[] = [
  { value: "video-focus", label: "Video Focus", hint: "Main video takes center stage, content and gallery below" },
  { value: "gallery-first", label: "Gallery First", hint: "Image grid at top, text below" },
  { value: "text-first", label: "Text First", hint: "Content leads, media supports below" },
  { value: "cover-hero", label: "Cover Hero", hint: "Full-width cover image with overlay text" },
  { value: "masonry", label: "Masonry", hint: "Pinterest-style image grid" },
];

function Section({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-surface/50">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-surface-2/50"
      >
        {open ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
        {title}
      </button>
      {open && <div className="border-t border-border/50 px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

export function ProjectForm({ initial }: { initial?: Project | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = Boolean(initial);
  const isDirty = useRef(false);

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
  const [mediaLoading, setMediaLoading] = useState(!!initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unsaved changes guard
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty.current) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Mark as dirty on any change
  const markDirty = useCallback(() => {
    isDirty.current = true;
  }, []);

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
      })
      .finally(() => setMediaLoading(false));
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

      isDirty.current = false;
      toast("success", isEdit ? "Project updated" : "Project created");
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  const selectedLayout = layoutOptions.find((l) => l.value === layout);

  return (
    <form onSubmit={handleSubmit} onChange={markDirty} className="flex flex-col gap-5">
      {/* Basic Info */}
      <Section title="Basic Info">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isEdit || !slug) setSlug(slugify(e.target.value));
                markDirty();
              }}
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="slug">Slug</Label>
              <button
                type="button"
                onClick={() => { setSlug(slugify(title)); markDirty(); }}
                className="mb-1.5 inline-flex items-center gap-1 font-mono text-[11px] text-accent transition-colors hover:underline"
              >
                <Wand2 size={11} />
                generate from title
              </button>
            </div>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => { setSlug(e.target.value); markDirty(); }}
              placeholder="my-project-slug"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                id="category"
                value={category}
                onChange={(e) => { setCategory(e.target.value as "school" | "personal"); markDirty(); }}
              >
                <option value="school">School</option>
                <option value="personal">Personal</option>
              </Select>
            </div>
            {category === "school" && (
              <div>
                <Label htmlFor="class_level">Class Level</Label>
                <Select
                  id="class_level"
                  value={classLevel}
                  onChange={(e) => { setClassLevel(e.target.value); markDirty(); }}
                >
                  {classLevels.map((c) => (
                    <option key={c} value={c}>
                      {c === "" ? "— None —" : `Kelas ${c.toUpperCase()}`}
                    </option>
                  ))}
                </Select>
              </div>
            )}
          </div>

          {category === "school" && (
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => { setSubject(e.target.value); markDirty(); }}
                placeholder="e.g. Produktif TKJ, Matematika, PAI..."
              />
              <p className="mt-1 text-[11px] text-muted">
                Projects with the same subject are grouped on the subject page.
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description</Label>
            <TextArea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => { setDescription(e.target.value); markDirty(); }}
              placeholder="Short summary shown on project cards"
            />
          </div>
        </div>
      </Section>

      {/* Content */}
      <Section title="Content">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="content">Markdown Content</Label>
            <TextArea
              id="content"
              rows={12}
              value={content}
              onChange={(e) => { setContent(e.target.value); markDirty(); }}
              placeholder="Project details in markdown..."
              className="font-mono text-[13px]"
            />
            <p className="mt-1 text-[11px] text-muted">
              Supports headings, lists, code blocks, images, and tables.
            </p>
          </div>

          <div>
            <Label htmlFor="link">External Link</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={(e) => { setLink(e.target.value); markDirty(); }}
              placeholder="https://github.com/naidrahiqa/..."
            />
          </div>
        </div>
      </Section>

      {/* Media */}
      <Section title="Media">
        <div className="flex flex-col gap-4">
          <FileUpload
            label="Cover Image"
            value={coverImage}
            onChange={(v) => { setCoverImage(v); markDirty(); }}
            accept="image/*"
          />

          <div className="rounded-lg border border-border/50 bg-surface-2/30 p-3">
            <p className="mb-2 text-xs font-semibold text-foreground">Hero Video</p>
            <p className="mb-3 text-[11px] text-muted">
              Main video shown on the project detail page. This is separate from the media gallery below.
            </p>
            <VideoFields
              url={videoUrl}
              type={videoType}
              onChange={(f) => {
                setVideoUrl(f.video_url);
                setVideoType(f.video_type);
                markDirty();
              }}
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold text-foreground">Media Gallery</p>
            <p className="mb-2 text-[11px] text-muted">
              Additional photos and videos shown in the gallery section below the main content.
            </p>
            {mediaLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/30 px-3 py-2 text-xs text-muted">
                <Loader2 size={14} className="animate-spin" />
                Loading existing media...
              </div>
            )}
            <MediaGallery items={media} onChange={(v) => { setMedia(v); markDirty(); }} />
          </div>
        </div>
      </Section>

      {/* Display Settings */}
      <Section title="Display Settings">
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="layout">Detail Layout</Label>
              <Select
                id="layout"
                value={layout}
                onChange={(e) => { setLayout(e.target.value as ProjectLayout); markDirty(); }}
              >
                {layoutOptions.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </Select>
              {selectedLayout && (
                <p className="mt-1 text-[11px] text-muted">{selectedLayout.hint}</p>
              )}
              <div className="mt-2">
                <LayoutPreview value={layout} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex w-fit cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => { setPublished(e.target.checked); markDirty(); }}
                className="h-4 w-4 accent-emerald-400"
              />
              <StatusPill ok={published} text={published ? "Published" : "Hidden"} />
            </label>
            <label className="flex w-fit cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => { setFeatured(e.target.checked); markDirty(); }}
                className="h-4 w-4 accent-accent"
              />
              <StatusPill ok={featured} text={featured ? "Featured" : "Not Featured"} />
            </label>
          </div>
        </div>
      </Section>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            if (isDirty.current && !window.confirm("Discard unsaved changes?")) return;
            router.push("/admin/projects");
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
