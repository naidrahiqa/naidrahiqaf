import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CLASS_LEVELS, cn } from "@/lib/utils";
import { ProjectReorderList } from "./ProjectReorderList";

export const dynamic = "force-dynamic";

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
    .order("sort_order", { ascending: true });
  
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
          <p className="mt-1 text-sm text-muted">
            Drag to reorder — the top items appear first on your site.{" "}
            {projects?.length ?? 0} total
          </p>
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

      {/* Reorderable list */}
      {projects && projects.length > 0 ? (
        <ProjectReorderList items={projects} />
      ) : (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          No projects yet
        </p>
      )}
    </div>
  );
}
