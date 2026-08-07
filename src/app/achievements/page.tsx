import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AchievementFilter } from "@/components/AchievementFilter";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Achievements — Naidrahiqa",
};

export default async function AchievementsPage() {
  const supabase = await createClient();

  const { data: achievements } = await supabase
    .from("achievements")
    .select("*")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-10 pt-12 sm:pt-16">
      <header>
        <p className="text-xs uppercase tracking-widest text-accent">
          Achievements
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Awards & <span className="gradient-text">Milestones</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Competitions, trainings, and seminars along the way.
        </p>
      </header>

      {achievements && achievements.length > 0 ? (
        <AchievementFilter items={achievements} />
      ) : (
        <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
          No achievements yet
        </p>
      )}
    </div>
  );
}
