"use client";

import { useEffect, useState } from "react";
import type { Contact } from "@/lib/types";
import { BrandIcon } from "@/components/BrandIcon";
import {
  Button,
  Card,
  Input,
  Label,
} from "@/components/admin/ui";

export default function ContactsEditorPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setContacts(data);
      })
      .catch(() => setError("Failed to load contacts"))
      .finally(() => setLoading(false));
  }, []);

  function update(id: string, patch: Partial<Contact>) {
    setSaved(false);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  async function saveAll() {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          contacts.map((c) => ({
            id: c.id,
            handle: c.handle,
            url: c.url,
            sort_order: c.sort_order,
          }))
        ),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Contacts</h1>
        <p className="mt-2 text-sm text-muted">
          These render on /contact and in the footer.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {contacts.map((c) => (
          <Card key={c.id} className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex items-center gap-3 sm:w-44">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted">
                <BrandIcon platform={c.platform} size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold capitalize">{c.platform}</p>
                <p className="text-[11px] text-muted">{c.handle}</p>
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor={`handle-${c.id}`}>handle</Label>
              <Input
                id={`handle-${c.id}`}
                value={c.handle}
                onChange={(e) => update(c.id, { handle: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={`url-${c.id}`}>url</Label>
              <Input
                id={`url-${c.id}`}
                value={c.url}
                onChange={(e) => update(c.id, { url: e.target.value })}
              />
            </div>
            <div className="w-20">
              <Label htmlFor={`sort-${c.id}`}>sort</Label>
              <Input
                id={`sort-${c.id}`}
                type="number"
                value={c.sort_order}
                onChange={(e) =>
                  update(c.id, { sort_order: Number(e.target.value) })
                }
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={saveAll} disabled={saving}>
          {saving ? "saving..." : "Save all"}
        </Button>
        {saved && (
          <span className="text-xs text-accent">Saved ✓</span>
        )}
      </div>
    </div>
  );
}
