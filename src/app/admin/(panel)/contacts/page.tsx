"use client";

import { useEffect, useState } from "react";
import type { Contact } from "@/lib/types";
import { BrandIcon } from "@/components/BrandIcon";
import {
  Button,
  Card,
  Input,
  Label,
  Select,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";

const platforms = ["email", "github", "instagram", "linkedin", "telegram", "whatsapp", "discord", "threads"];

export default function ContactsEditorPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function addContact() {
    const newId = `new-${Date.now()}`;
    setContacts((prev) => [
      ...prev,
      {
        id: newId,
        platform: "email",
        handle: "",
        url: "",
        sort_order: prev.length,
      },
    ]);
  }

  function removeContact(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }

  async function saveAll() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          contacts.map((c) => ({
            id: c.id,
            platform: c.platform,
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
      toast("success", "Contacts saved");
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
              <div className="flex-1">
                <Label htmlFor={`platform-${c.id}`}>Platform</Label>
                <Select
                  id={`platform-${c.id}`}
                  value={c.platform}
                  onChange={(e) => update(c.id, { platform: e.target.value })}
                >
                  {platforms.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </Select>
              </div>
            </div>
            <div className="flex-1">
              <Label htmlFor={`handle-${c.id}`}>Handle</Label>
              <Input
                id={`handle-${c.id}`}
                value={c.handle}
                onChange={(e) => update(c.id, { handle: e.target.value })}
                placeholder={c.platform === "email" ? "email@example.com" : "username"}
              />
              <p className="mt-0.5 text-[10px] text-muted">
                {c.platform === "email" ? "Your email address" : "Display name or username"}
              </p>
            </div>
            <div className="flex-1">
              <Label htmlFor={`url-${c.id}`}>URL</Label>
              <Input
                id={`url-${c.id}`}
                value={c.url}
                onChange={(e) => update(c.id, { url: e.target.value })}
                placeholder={c.platform === "email" ? "mailto:email@example.com" : `https://${c.platform}.com/...`}
              />
              <p className="mt-0.5 text-[10px] text-muted">
                Full link including https://
              </p>
            </div>
            <div className="w-20">
              <Label htmlFor={`sort-${c.id}`}>Sort</Label>
              <Input
                id={`sort-${c.id}`}
                type="number"
                value={c.sort_order}
                onChange={(e) =>
                  update(c.id, { sort_order: Number(e.target.value) })
                }
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => removeContact(c.id)}
              className="sm:w-20"
            >
              Remove
            </Button>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={addContact}>
          + Add Contact
        </Button>
        <Button type="button" onClick={saveAll} disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </Button>
      </div>
    </div>
  );
}