import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn, formatDate, slugify } from "@/lib/utils";
import { MarkdownContent } from "@/components/MarkdownContent";
import { VideoEmbed } from "@/components/VideoEmbed";
import { ProjectGallery } from "@/components/ProjectGallery";

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return {
    title: data?.title ?? "Project",
    description: data?.description,
  };
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) notFound();

  const { data: media } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order");

  const backHref =
    project.category === "school" && project.class_level
      ? project.subject
        ? `/projects/school/${project.class_level}/${slugify(project.subject)}`
        : `/projects/school/${project.class_level}`
      : "/projects";
  const backLabel =
    project.category === "school" && project.class_level
      ? project.subject
        ? project.subject
        : `Kelas ${project.class_level}`
      : "Projects";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pt-12 sm:pt-16">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} />
        {backLabel}
      </Link>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider",
              project.category === "school"
                ? "border-accent/30 text-accent"
                : "border-accent-2/30 text-accent-2"
            )}
          >
            {project.category}
          </span>
          {project.category === "school" && project.class_level && (
            <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] uppercase text-muted">
              class {project.class_level}
            </span>
          )}
          {project.category === "school" && project.subject && (
            <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[11px] text-muted">
              {project.subject}
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">
          {project.title}
        </h1>
        {project.description && (
          <p className="leading-relaxed text-muted">{project.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
          <time>{formatDate(project.created_at)}</time>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent hover:underline"
            >
              <ExternalLink size={13} />
              GitHub
            </a>
          )}
        </div>
      </header>

      <VideoEmbed
        url={project.video_url}
        type={project.video_type}
        title={project.title}
      />

      <ProjectGallery media={media ?? []} />

      {project.content && <MarkdownContent content={project.content} />}
    </div>
  );
}
