import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { LogoutButton } from "@/components/admin/LogoutButton";
import {
  LayoutDashboard,
  FolderGit2,
  Award,
  LayoutList,
  Users,
  UserCircle,
  ExternalLink,
} from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2 },
  { href: "/admin/achievements", label: "Achievements", icon: Award },
  { href: "/admin/about", label: "About", icon: LayoutList },
  { href: "/admin/contacts", label: "Contacts", icon: Users },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
];

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-[80vh] flex-col gap-8 pt-10 lg:flex-row">
      <aside className="shrink-0 lg:w-56">
        <div className="glass rounded-xl p-4 lg:sticky lg:top-20">
          <div className="mb-3 hidden px-1 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted/60">
              Admin Panel
            </p>
          </div>
          <nav className="flex flex-wrap gap-1 lg:flex-col">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-all duration-200 hover:bg-accent/10 hover:text-accent"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-all duration-200 hover:bg-accent/10 hover:text-accent"
            >
              <ExternalLink size={16} />
              View Site
            </Link>
          </nav>
          <div className="mt-3 border-t border-border/50 pt-3">
            <LogoutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
