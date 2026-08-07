import Link from "next/link";
import {
  FolderGit2,
  Award,
  LayoutList,
  Users,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const cards = [
  {
    label: "Projects",
    href: "/admin/projects",
    icon: FolderGit2,
    get: (s: { projects: number }) => s.projects,
  },
  {
    label: "Achievements",
    href: "/admin/achievements",
    icon: Award,
    get: (s: { achievements: number }) => s.achievements,
  },
  {
    label: "About Sections",
    href: "/admin/about",
    icon: LayoutList,
    get: (s: { about: number }) => s.about,
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: Users,
    get: (s: { contacts: number }) => s.contacts,
  },
];

const quickActions = [
  { href: "/admin/projects/new", label: "New Project", icon: FolderGit2 },
  { href: "/admin/achievements/new", label: "New Achievement", icon: Award },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: projects }, { count: achievements }, { count: about }, { count: contacts }] =
    await Promise.all([
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("achievements").select("id", { count: "exact", head: true }),
      supabase.from("about_sections").select("id", { count: "exact", head: true }),
      supabase.from("contacts").select("id", { count: "exact", head: true }),
    ]);

  const stats = {
    projects: projects ?? 0,
    achievements: achievements ?? 0,
    about: about ?? 0,
    contacts: contacts ?? 0,
  };

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          Manage your portal content from here.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group glass flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:border-border-hover hover:glow-accent hover:-translate-y-0.5"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-105">
              <c.icon size={20} />
            </span>
            <div className="min-w-0">
              <p className="text-2xl font-bold">{c.get(stats)}</p>
              <p className="truncate text-xs text-muted">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface/50 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all duration-200 hover:border-border-hover hover:text-accent hover:-translate-y-0.5"
            >
              <Plus size={15} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
