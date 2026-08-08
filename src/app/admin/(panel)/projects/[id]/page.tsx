import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ChevronRight } from "lucide-react";

export default async function EditProjectPage({
  params,
}: PageProps<"/admin/projects/[id]">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/admin/projects" className="hover:text-accent">
          Projects
        </Link>
        <ChevronRight size={14} className="text-muted/50" />
        <span className="font-medium text-foreground truncate max-w-[200px]">
          {project.title}
        </span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight">Edit Project</h1>
      </header>
      <ProjectForm initial={project} />
    </div>
  );
}