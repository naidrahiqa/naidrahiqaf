import Link from "next/link";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ChevronRight } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/admin/projects" className="hover:text-accent">
          Projects
        </Link>
        <ChevronRight size={14} className="text-muted/50" />
        <span className="font-medium text-foreground">New</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold tracking-tight">New Project</h1>
      </header>
      <ProjectForm />
    </div>
  );
}