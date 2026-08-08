import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ToastProvider } from "@/components/admin/Toast";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  if (!user) redirect("/admin/login");

  return (
    <ToastProvider>
      <div className="flex min-h-[80vh] flex-col gap-8 pt-10 lg:flex-row">
        <aside className="shrink-0 lg:w-56">
          <div className="glass rounded-xl p-4 lg:sticky lg:top-20">
            <AdminSidebar email={user.email ?? ""} />
            <div className="mt-3 border-t border-border/50 pt-3">
              <LogoutButton />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </ToastProvider>
  );
}
