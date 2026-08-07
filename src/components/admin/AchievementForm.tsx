"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Achievement } from "@/lib/types";
import {
  Button,
  Card,
  Input,
  Label,
  Select,
  TextArea,
} from "@/components/admin/ui";
import { FileUpload } from "@/components/admin/FileUpload";

export function AchievementForm({
  initial,
}: {
  initial?: Achievement | null;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [event, setEvent] = useState(initial?.event ?? "");
  const [category, setCategory] = useState<Achievement["category"]>(
    initial?.category ?? "competition"
  );
  const [year, setYear] = useState(initial?.year ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [certificateUrl, setCertificateUrl] = useState<string | null>(
    initial?.certificate_url ?? null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      event,
      category,
      year,
      description,
      certificate_url: certificateUrl,
    };

    try {
      const res = await fetch(
        isEdit
          ? `/api/admin/achievements/${initial!.id}`
          : "/api/admin/achievements",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      router.push("/admin/achievements");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <div>
          <Label htmlFor="title">title *</Label>
          <Input
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="2nd Place — LKS Kabupaten Jepara 2026"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">category</Label>
            <Select
              id="category"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Achievement["category"])
              }
            >
              <option value="competition">competition</option>
              <option value="training">training</option>
              <option value="seminar">seminar</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="year">year</Label>
            <Input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="event">event</Label>
          <Input
            id="event"
            value={event}
            onChange={(e) => setEvent(e.target.value)}
            placeholder="Lomba Kompetensi Siswa (LKS) — IT Network System Administration"
          />
        </div>

        <div>
          <Label htmlFor="description">description</Label>
          <TextArea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details about this achievement"
          />
        </div>

        <FileUpload
          label="certificate (pdf/image)"
          value={certificateUrl}
          onChange={setCertificateUrl}
          accept="application/pdf,image/*"
        />
      </Card>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "saving..." : isEdit ? "Save changes" : "Create achievement"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/achievements")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
