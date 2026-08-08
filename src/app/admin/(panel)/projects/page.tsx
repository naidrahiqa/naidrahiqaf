import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CLASS_LEVELS, cn } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { StatusPill } from "@/components/admin/ui";

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; class?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const classLevel = params.class;
  
  const supabase = await createClient();
  let query = supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (category === "school" || category === "personal") {
    query = query.eq("category", category);
  }
  
  if (category === "school" && classLevel && CLASS_LEVELS.includes(classLevel as (typeof CLASS_LEVELS)[number])) {
    query = query.eq("class_level", classLevel);
  }
  
  const { data: projects } = await query;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted">{projects?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5"
        >
          <Plus size={15} />
          New Project
        </Link>
      </header>

      {/* Category tabs */}
      <div className="flex gap-2">
        <Link
          href="/admin/projects"
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            !category
              ? "bg-accent text-on-accent"
              : "bg-surface-2 text-muted hover:text-foreground"
          )}
        >
          All
        </Link>
        <Link
          href="/admin/projects?category=school"
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            category === "school"
              ? "bg-accent text-on-accent"
              : "bg-surface-2 text-muted hover:text-foreground"
          )}
        >
          School
        </Link>
        <Link
          href="/admin/projects?category=personal"
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
            category === "personal"
              ? "bg-accent text-on-accent"
              : "bg-surface-2 text-muted hover:text-foreground"
          )}
        >
          Personal
        </Link>
      </div>

      {/* Class filter — only when School is active */}
      {category === "school" && (
        <div className="flex gap-1.5">
          <Link
            href="/admin/projects?category=school"
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
              !classLevel
                ? "bg-accent/15 text-accent"
                : "bg-surface-2 text-muted hover:text-foreground"
            )}
          >
            All
          </Link>
          {CLASS_LEVELS.map((cls) => (
            <Link
              key={cls}
              href={`/admin/projects?category=school&class=${cls}`}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                classLevel === cls
                  ? "bg-accent/15 text-accent"
                  : "bg-surface-2 text-muted hover:text-foreground"
              )}
            >
              Kelas {cls.toUpperCase()}
            </Link>
          ))}
        </div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((project) => (
              <tr
                key={project.id}
                className="border-b border-border/50 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="font-medium hover:text-accent"
                    >
                      {project.title}
                    </Link>
                    {project.featured && (
                      <Star size={14} className="fill-accent text-accent" />
                    )}
                  </div>
                  <p className="text-[11px] text-muted">
                    /projects/{project.slug}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[11px] uppercase",
                      project.category === "school"
                        ? "border-accent/30 text-accent"
                        : "border-accent-2/30 text-accent-2"
                    )}
                  >
                    {project.category}
                    {project.class_level ? ` · kelas ${project.class_level}` : ""}
                    {project.subject ? ` · ${project.subject}` : ""}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <StatusPill ok={project.published} text={project.published ? "published" : "hidden"} />
                    {project.featured && (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[11px] text-accent">featured</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <FeaturedToggle id={project.id} featured={project.featured} />
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent"
                    >
                      Edit
                    </Link>
                    <DeleteButton entity="projects" id={project.id} name={project.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!projects || projects.length === 0) && (
          <p className="p-8 text-center text-sm text-muted">
            No projects yet
          </p>
        )}
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {projects?.map((project) => (
          <div
            key={project.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-semibold hover:text-accent"
                  >
                    {project.title}
                  </Link>
                  {project.featured && (
                    <Star size={14} className="fill-accent text-accent" />
                  )}
                </div>
                <p className="text-[11px] text-muted">/projects/{project.slug}</p>
              </div>
              <StatusPill ok={project.published} text={project.published ? "pub" : "hid"} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[10px] uppercase",
                  project.category === "school"
                    ? "border-accent/30 text-accent"
                    : "border-accent-2/30 text-accent-2"
                )}
              >
                {project.category}
                {project.class_level ? ` · ${project.class_level}` : ""}
                {project.subject ? ` · ${project.subject}` : ""}
              </span>
              {project.featured && (
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] text-accent">featured</span>
              )}
            </div>
            <div className="flex gap-2">
              <FeaturedToggle id={project.id} featured={project.featured} />
              <Link
                href={`/admin/projects/${project.id}`}
                className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                Edit
              </Link>
              <DeleteButton entity="projects" id={project.id} name={project.title} />
            </div>
          </div>
        ))}
        {(!projects || projects.length === 0) && (
          <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
            No projects yet
          </p>
        )}
      </div>
    </div>
  );
}
