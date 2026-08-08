"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

export function DeleteButton({
  entity,
  id,
  name,
}: {
  entity: "posts" | "projects" | "achievements";
  id: string;
  name?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    const label = name ? `"${name}"` : "this item";
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/${entity}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Delete failed");
      }
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-md border border-danger/30 bg-danger/10 px-2.5 py-1.5 text-xs font-semibold text-danger transition-colors hover:bg-danger/20 disabled:opacity-50"
    >
      <Trash2 size={13} />
      {busy ? "..." : "delete"}
    </button>
  );
}