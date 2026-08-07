import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AchievementBadge } from "@/components/cards";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminAchievementsPage() {
  const supabase = await createClient();
  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
          <p className="mt-1 text-sm text-muted">{achievements?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition-all duration-200 hover:bg-accent/90 hover:-translate-y-0.5"
        >
          <Plus size={15} />
          New Achievement
        </Link>
      </header>

      <div className="flex flex-col gap-3">
        {achievements?.map((a) => (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4"
          >
            <div className="min-w-0">
              <p className="font-semibold">{a.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <AchievementBadge category={a.category} />
                <span className="text-xs text-muted">{a.year}</span>
                {a.event && (
                  <span className="text-[11px] text-muted truncate">
                    {a.event}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/achievements/${a.id}`}
                className="rounded-md border border-border bg-surface-2 px-2.5 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/50 hover:text-accent"
              >
                Edit
              </Link>
              <DeleteButton entity="achievements" id={a.id} />
            </div>
          </div>
        ))}
        {(!achievements || achievements.length === 0) && (
          <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
            No achievements yet
          </p>
        )}
      </div>
    </div>
  );
}
