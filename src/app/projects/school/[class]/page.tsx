import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CLASS_LEVELS, slugify } from "@/lib/utils";
import { SubjectRow, ProjectCard } from "@/components/cards";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "School Projects",
  description: "School projects per class — Naidrahiqa",
};

interface SubjectGroup {
  name: string;
  slug: string;
  items: Project[];
}

export default async function SchoolClassPage({
  params,
}: PageProps<"/projects/school/[class]">) {
  const { class: cls } = await params;
  if (!CLASS_LEVELS.includes(cls as (typeof CLASS_LEVELS)[number])) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("category", "school")
    .eq("class_level", cls)
    .order("created_at", { ascending: false });

  const items = (data ?? []) as Project[];
  if (items.length === 0) notFound();

  const groups: SubjectGroup[] = [];
  const bySubject = new Map<string, Project[]>();
  const unfiled: Project[] = [];

  for (const item of items) {
    if (item.subject) {
      const key = slugify(item.subject);
      if (!bySubject.has(key)) bySubject.set(key, []);
      bySubject.get(key)!.push(item);
    } else {
      unfiled.push(item);
    }
  }

  for (const [key, list] of bySubject) {
    groups.push({
      name: list[0].subject,
      slug: key,
      items: list,
    });
  }
  groups.sort((a, b) => a.name.localeCompare(b.name));

  if (unfiled.length > 0) {
    groups.push({
      name: "Lainnya",
      slug: "lainnya",
      items: unfiled,
    });
  }

  const hasOnlyUnfiled = groups.length === 1 && groups[0].slug === "lainnya";

  return (
    <div className="flex flex-col gap-10 pt-12 sm:pt-16">
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} />
        Semua kelas
      </Link>

      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-wider text-accent">
          School
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Kelas <span className="gradient-text">{cls.toUpperCase()}</span>
        </h1>
        <p className="mt-3 text-muted">
          {hasOnlyUnfiled
            ? `${items.length} showcase`
            : `${groups.length} mapel · ${items.length} showcase`}
        </p>
      </header>

      {hasOnlyUnfiled ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {groups.map((g) => (
            <SubjectRow
              key={g.slug}
              cls={cls}
              subject={g.name}
              slug={g.slug}
              itemCount={g.items.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
