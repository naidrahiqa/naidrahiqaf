import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CLASS_LEVELS } from "@/lib/utils";
import { ClassCard, ProjectCard } from "@/components/cards";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects — Naidrahiqa",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  const all = (projects ?? []) as Project[];
  const school = all.filter((p) => p.category === "school");
  const personal = all.filter((p) => p.category === "personal");

  const classes = CLASS_LEVELS.map((cls) => {
    const items = school.filter((p) => p.class_level === cls);
    const subjectSet = new Set(items.map((p) => p.subject).filter(Boolean));
    return {
      cls,
      items,
      subjectCount: subjectSet.size,
      subjects: [...subjectSet].sort(),
      cover: items[0]?.cover_image ?? null,
    };
  }).filter((c) => c.items.length > 0);

  return (
    <div className="flex flex-col gap-16 pt-12 sm:pt-16">
      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-accent">
          Projects
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          My <span className="gradient-text">Work</span>
        </h1>
        <p className="mt-4 text-muted">
          School work organized by class and subject, plus personal builds —
          kernels, IoT, Android modding, and more.
        </p>
      </header>

      {classes.length > 0 && (
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent">
              School
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Per Kelas
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <ClassCard
                key={c.cls}
                cls={c.cls}
                itemCount={c.items.length}
                subjects={c.subjects}
              />
            ))}
          </div>
        </section>
      )}

      {personal.length > 0 && (
        <section className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent-2">
              Personal
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              From GitHub
            </h2>
            <p className="mt-2 text-sm text-muted">
              {personal.length} projects — kernels, modules, tools, and web
              apps.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {personal.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </section>
      )}

      {all.length === 0 && (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          No projects yet
        </p>
      )}
    </div>
  );
}
