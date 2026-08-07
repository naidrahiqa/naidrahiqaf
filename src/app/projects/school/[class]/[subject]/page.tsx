import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CLASS_LEVELS, slugify } from "@/lib/utils";
import { ProjectCard } from "@/components/cards";
import type { Project } from "@/lib/types";

export default async function SchoolSubjectPage({
  params,
}: PageProps<"/projects/school/[class]/[subject]">) {
  const { class: cls, subject } = await params;
  if (!CLASS_LEVELS.includes(cls as (typeof CLASS_LEVELS)[number])) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .eq("category", "school")
    .eq("class_level", cls)
    .order("created_at", { ascending: false });

  const items = ((data ?? []) as Project[]).filter(
    (p) =>
      (p.subject ? slugify(p.subject) : "lainnya") === subject ||
      (!p.subject && subject === "lainnya")
  );

  if (items.length === 0) notFound();

  const displayName =
    subject === "lainnya" ? "Lainnya" : (items[0].subject || subject);

  return (
    <div className="flex flex-col gap-10 pt-12 sm:pt-16">
      <Link
        href={`/projects/school/${cls}`}
        className="inline-flex w-fit items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} />
        Kelas {cls.toUpperCase()}
      </Link>

      <header className="max-w-2xl">
        <p className="text-xs uppercase tracking-wider text-accent">
          {cls.toUpperCase()} · mapel
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {displayName}
        </h1>
        <p className="mt-3 text-muted">{items.length} showcase</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
