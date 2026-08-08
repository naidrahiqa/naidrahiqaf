import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn, getStoragePath, storagePublicUrl } from "@/lib/utils";
import type { Project, Achievement } from "@/lib/types";

function resolveCover(cover: string | null | undefined): string | null {
  if (!cover) return null;
  const path = getStoragePath(cover);
  return path ? storagePublicUrl(path) : cover;
}

export function ProjectCard({ project }: { project: Project }) {
  const imgSrc = resolveCover(project.cover_image);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-xl border-2 border-foreground bg-surface hard-shadow-sm transition-all duration-200 hover:-translate-y-1 hover:hard-shadow-hover"
    >
      {imgSrc ? (
        <div className="aspect-video overflow-hidden border-b-2 border-foreground bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center border-b-2 border-foreground bg-gradient-to-br from-surface-2 to-surface">
          <span className="font-display text-4xl font-black text-border/60">
            {project.title.charAt(0)}
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.category === "school" && project.class_level && (
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-accent">
              kelas {project.class_level}
            </span>
          )}
          {project.category === "school" && project.subject && (
            <span className="rounded-full border-2 border-border bg-surface-2 px-2 py-0.5 text-[10px] font-semibold text-muted">
              {project.subject}
            </span>
          )}
          {project.category === "personal" && (
            <span className="rounded-full bg-accent-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              personal
            </span>
          )}
        </div>
        <h3 className="mt-2 font-display font-bold uppercase leading-snug tracking-tight transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">
          {project.description}
        </p>
      </div>
    </Link>
  );
}

export function ClassCard({
  cls,
  subjects,
  itemCount,
}: {
  cls: string;
  subjects: string[];
  itemCount: number;
}) {
  return (
    <Link
      href={`/projects/school/${cls}`}
      className="group relative block overflow-hidden rounded-2xl border-2 border-foreground bg-surface p-6 hard-shadow transition-all duration-200 hover:-translate-y-1 hover:hard-shadow-hover"
    >
      <div className="absolute -top-4 -right-4 font-display text-[90px] font-black uppercase leading-none tracking-tighter text-accent/10 transition-colors group-hover:text-accent/20">
        {cls}
      </div>
      <div className="relative z-10">
        <h3 className="font-display text-xl font-extrabold uppercase tracking-tight transition-colors group-hover:text-accent">
          Kelas {cls.toUpperCase()}
        </h3>
        <p className="mt-0.5 text-sm font-semibold text-muted">
          {itemCount} showcase
        </p>
        {subjects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {subjects.slice(0, 4).map((s, i) => (
              <span
                key={s}
                className={cn(
                  "rounded-full border-2 bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted",
                  i % 2 === 0 ? "border-accent/40 -rotate-1" : "border-border rotate-1"
                )}
              >
                {s}
              </span>
            ))}
            {subjects.length > 4 && (
              <span className="rounded-full border-2 border-border bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
                +{subjects.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export function SubjectRow({
  cls,
  subject,
  slug,
  itemCount,
}: {
  cls: string;
  subject: string;
  slug: string;
  itemCount: number;
}) {
  return (
    <Link
      href={`/projects/school/${cls}/${slug}`}
      className="group flex items-center justify-between rounded-xl border-2 border-foreground bg-surface px-5 py-4 hard-shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:hard-shadow-hover"
    >
      <div>
        <h3 className="font-display font-bold uppercase tracking-tight transition-colors group-hover:text-accent">
          {subject}
        </h3>
        <p className="mt-0.5 text-sm font-semibold text-muted">{itemCount} showcase</p>
      </div>
      <ArrowRight
        size={16}
        className="text-accent transition-all duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}

export function AchievementBadge({
  category,
}: {
  category: Achievement["category"];
}) {
  const styles: Record<Achievement["category"], string> = {
    competition: "border-foreground bg-accent text-on-accent",
    training: "border-foreground bg-accent-2 text-white",
    seminar: "border-foreground bg-surface text-foreground",
  };
  return (
    <span
      className={cn(
        "rounded-full border-2 px-2.5 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider",
        styles[category]
      )}
    >
      {category}
    </span>
  );
}