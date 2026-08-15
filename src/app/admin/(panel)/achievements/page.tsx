import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AchievementReorderList } from "./AchievementReorderList";

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
          <p className="mt-1 text-sm text-muted">
            Drag the handle to reorder — the top items appear first on your site.
          </p>
        </div>
        <Link
          href="/admin/achievements/new"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent transition-all duration-200 hover:bg-accent-hover hover:-translate-y-0.5"
        >
          <Plus size={15} />
          New Achievement
        </Link>
      </header>

      {achievements && achievements.length > 0 ? (
        <AchievementReorderList items={achievements} />
      ) : (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          No achievements yet
        </p>
      )}
    </div>
  );
}

