"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function FeaturedToggle({
  id,
  featured,
}: {
  id: string;
  featured: boolean;
}) {
  const [value, setValue] = useState(featured);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !value }),
      });
      if (res.ok) setValue(!value);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={value ? "Unfeature from homepage" : "Feature on homepage"}
      aria-label={value ? "Unfeature" : "Feature"}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition-colors",
        value
          ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
          : "border-border bg-surface-2 text-muted hover:text-accent",
        busy && "opacity-50"
      )}
    >
      <Star size={13} className={value ? "fill-accent" : ""} />
      {value ? "featured" : "feature"}
    </button>
  );
}