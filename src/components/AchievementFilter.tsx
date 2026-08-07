"use client";

import { useState } from "react";
import { Award, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { AchievementBadge } from "@/components/cards";
import type { Achievement } from "@/lib/types";

const filters = [
  { key: "all", label: "all" },
  { key: "competition", label: "competitions" },
  { key: "training", label: "trainings" },
  { key: "seminar", label: "seminars" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export function AchievementFilter({ items }: { items: Achievement[] }) {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered =
    active === "all" ? items : items.filter((a) => a.category === active);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
              active === f.key
                ? "border-accent bg-accent/10 text-accent glow-accent"
                : "border-border bg-surface/50 text-muted hover:text-foreground hover:border-border-hover"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((a, i) => (
          <div
            key={a.id}
            className="glass group flex flex-col gap-3 rounded-xl p-5 transition-all duration-300 hover:border-border-hover hover:glow-accent"
          >
            <div className="flex items-center justify-between gap-3">
              <AchievementBadge category={a.category} />
              <span className="text-xs text-muted">{a.year}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 text-sm text-accent/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-snug">{a.title}</h3>
                {a.event && <p className="mt-1 text-sm text-muted">{a.event}</p>}
              </div>
            </div>
            {a.description && (
              <p className="text-sm leading-relaxed text-muted">{a.description}</p>
            )}
            {a.certificate_url && (
              <a
                href={a.certificate_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs text-accent transition-colors hover:underline"
              >
                <Award size={13} />
                certificate
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
