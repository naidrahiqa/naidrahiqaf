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
      className="group glass block overflow-hidden rounded-xl transition-all duration-300 hover:border-border-hover hover:glow-accent hover:-translate-y-1"
    >
      {imgSrc ? (
        <div className="aspect-video overflow-hidden bg-surface-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-surface-2 to-surface">
          <span className="text-4xl font-bold text-border/60">
            {project.title.charAt(0)}
          </span>
        </div>
      )}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.category === "school" && project.class_level && (
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
              kelas {project.class_level}
            </span>
          )}
          {project.category === "school" && project.subject && (
            <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-muted">
              {project.subject}
            </span>
          )}
          {project.category === "personal" && (
            <span className="rounded-full bg-accent-2/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-2">
              personal
            </span>
          )}
        </div>
        <h3 className="mt-2 font-semibold leading-snug transition-colors group-hover:text-accent">
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
      className="glass group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:border-border-hover hover:glow-accent hover:-translate-y-1"
    >
      <div className="absolute -top-6 -right-6 text-[100px] font-black leading-none tracking-tighter text-accent/5 transition-colors group-hover:text-accent/10">
        {cls}
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-bold transition-colors group-hover:text-accent">
          Kelas {cls.toUpperCase()}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {itemCount} showcase
        </p>
        {subjects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {subjects.slice(0, 4).map((s) => (
              <span
                key={s}
                className="rounded-full border border-border bg-surface-2/50 px-2 py-0.5 text-[11px] text-muted backdrop-blur-sm"
              >
                {s}
              </span>
            ))}
            {subjects.length > 4 && (
              <span className="rounded-full border border-border bg-surface-2/50 px-2 py-0.5 text-[11px] text-muted backdrop-blur-sm">
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
      className="glass group flex items-center justify-between rounded-xl px-5 py-4 transition-all duration-300 hover:border-border-hover hover:bg-surface-2/30"
    >
      <div>
        <h3 className="font-medium transition-colors group-hover:text-accent">
          {subject}
        </h3>
        <p className="mt-0.5 text-sm text-muted">{itemCount} showcase</p>
      </div>
      <ArrowRight
        size={16}
        className="text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
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
    competition: "border-accent/30 text-accent bg-accent/5",
    training: "border-accent-2/30 text-accent-2 bg-accent-2/5",
    seminar: "border-amber-400/30 text-amber-400 bg-amber-400/5",
  };
  return (
    <span
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider",
        styles[category]
      )}
    >
      {category}
    </span>
  );
}
