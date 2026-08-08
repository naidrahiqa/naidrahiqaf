"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: FolderGit2, exact: false },
  { href: "/admin/achievements", label: "Achievements", icon: Award, exact: false },
  { href: "/admin/about", label: "About", icon: LayoutList, exact: false },
  { href: "/admin/contacts", label: "Contacts", icon: Users, exact: false },
  { href: "/admin/profile", label: "Profile", icon: UserCircle, exact: false },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <>
      <div className="mb-3 hidden px-1 lg:block">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted/60">
          Admin Panel
        </p>
        <p className="mt-1 truncate text-xs text-muted">{email}</p>
      </div>
      <nav className="flex flex-wrap gap-1 lg:flex-col">
        {nav.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-accent/15 font-semibold text-accent"
                  : "text-muted hover:bg-accent/10 hover:text-accent"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted transition-all duration-200 hover:bg-accent/10 hover:text-accent"
        >
          <ExternalLink size={16} />
          View Site
        </Link>
      </nav>
    </>
  );
}