"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { AboutSection } from "@/lib/types";
import {
  Button,
  Card,
  Input,
  Label,
  TextArea,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";

export default function AboutEditorPage() {
  const { toast } = useToast();
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({ key: "", heading: "" });

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSections(data);
      })
      .catch(() => setError("Failed to load sections"))
      .finally(() => setLoading(false));
  }, []);

  async function saveSection(id: string) {
    setSavingId(id);
    setError(null);
    const section = sections.find((s) => s.id === id);
    if (!section) return;
    try {
      const res = await fetch(`/api/admin/about/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: section.key,
          heading: section.heading,
          content: section.content,
          sort_order: section.sort_order,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      toast("success", "Section saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function deleteSection(id: string) {
    const section = sections.find((s) => s.id === id);
    const label = section?.heading ?? "this section";
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/about/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Delete failed");
      }
      setSections((prev) => prev.filter((s) => s.id !== id));
      toast("success", "Section deleted");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function createSection(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/about", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newSection.key.trim(),
          heading: newSection.heading.trim(),
          content: "",
          sort_order: sections.length + 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Create failed");
      setSections((prev) => [...prev, data]);
      setNewSection({ key: "", heading: "" });
      toast("success", "Section created");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    }
  }

  function update(id: string, patch: Partial<AboutSection>) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...patch } : s))
    );
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">About Sections</h1>
        <p className="mt-2 text-sm text-muted">
          Each section renders on /about with its heading. Content supports markdown.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {sections.map((section) => (
          <Card key={section.id} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <div>
                <Label htmlFor={`heading-${section.id}`}>Heading</Label>
                <Input
                  id={`heading-${section.id}`}
                  value={section.heading}
                  onChange={(e) => update(section.id, { heading: e.target.value })}
                />
                <p className="mt-0.5 text-[10px] text-muted">
                  Displayed as the section title on /about
                </p>
              </div>
              <div>
                <Label htmlFor={`key-${section.id}`}>Key</Label>
                <Input
                  id={`key-${section.id}`}
                  value={section.key}
                  onChange={(e) => update(section.id, { key: e.target.value })}
                />
                <p className="mt-0.5 text-[10px] text-muted">
                  Internal identifier (no spaces)
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor={`content-${section.id}`}>Content (Markdown)</Label>
              <TextArea
                id={`content-${section.id}`}
                rows={6}
                value={section.content}
                onChange={(e) => update(section.id, { content: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="w-28">
                <Label htmlFor={`sort-${section.id}`}>Sort Order</Label>
                <Input
                  id={`sort-${section.id}`}
                  type="number"
                  value={section.sort_order}
                  onChange={(e) =>
                    update(section.id, { sort_order: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => saveSection(section.id)}
                  disabled={savingId === section.id}
                >
                  {savingId === section.id ? "Saving..." : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => deleteSection(section.id)}
                  disabled={deletingId === section.id}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col gap-4">
        <p className="text-sm font-semibold">Add Section</p>
        <form onSubmit={createSection} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="new-heading">Heading</Label>
            <Input
              id="new-heading"
              required
              value={newSection.heading}
              onChange={(e) =>
                setNewSection((prev) => ({ ...prev, heading: e.target.value }))
              }
              placeholder="e.g. Projects I Admire"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="new-key">Key</Label>
            <Input
              id="new-key"
              required
              value={newSection.key}
              onChange={(e) =>
                setNewSection((prev) => ({ ...prev, key: e.target.value }))
              }
              placeholder="e.g. projects_i_admire"
            />
          </div>
          <Button type="submit" className="sm:mb-0">
            <Plus size={15} />
            Add
          </Button>
        </form>
      </Card>
    </div>
  );
}