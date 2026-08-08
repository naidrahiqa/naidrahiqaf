import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CLASS_LEVELS, slugify } from "@/lib/utils";
import { SubjectRow } from "@/components/cards";
import type { Project } from "@/lib/types";

export const metadata: Metadata = {
  title: "School Projects",
  description: "School projects per class — Naidrahiqa",
};

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

  const groups: { name: string; items: Project[] }[] = [];
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

  for (const [, list] of bySubject) {
    groups.push({ name: list[0].subject, items: list });
  }
  groups.sort((a, b) => a.name.localeCompare(b.name));

  if (unfiled.length > 0) {
    groups.push({ name: "Lainnya", items: unfiled });
  }

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
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Kelas <span className="gradient-text">{cls.toUpperCase()}</span>
        </h1>
        <p className="mt-3 text-muted">
          {groups.length} mapel · {items.length} showcase
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {groups.map((g) => (
          <SubjectRow
            key={slugify(g.name)}
            cls={cls}
            subject={g.name}
            slug={slugify(g.name)}
            itemCount={g.items.length}
          />
        ))}
      </div>
    </div>
  );
}
