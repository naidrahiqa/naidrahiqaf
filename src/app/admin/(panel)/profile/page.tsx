"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import {
  Button,
  Card,
  Input,
  Label,
  TextArea,
} from "@/components/admin/ui";
import { FileUpload } from "@/components/admin/FileUpload";

export default function ProfileEditorPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object") setProfile(data);
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    if (!profile) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name,
          nickname: profile.nickname,
          tagline: profile.tagline,
          hero_description: profile.hero_description,
          profile_image: profile.profile_image,
        }),
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

  if (!profile) {
    return (
      <p className="rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted">
        Profile not found — run the seed migration first
      </p>
    );
  }

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </header>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Card className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="nickname">nickname</Label>
          <Input
            id="nickname"
            value={profile.nickname}
            onChange={(e) =>
              setProfile({ ...profile, nickname: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="tagline">tagline</Label>
          <Input
            id="tagline"
            value={profile.tagline}
            onChange={(e) =>
              setProfile({ ...profile, tagline: e.target.value })
            }
            placeholder="TKJ Student | Kernel Developer | IoT Builder | CyberSecurity Enthusiast"
          />
        </div>
        <div>
          <Label htmlFor="hero">hero description</Label>
          <TextArea
            id="hero"
            rows={3}
            value={profile.hero_description}
            onChange={(e) =>
              setProfile({ ...profile, hero_description: e.target.value })
            }
          />
        </div>
        <FileUpload
          label="profile image"
          value={profile.profile_image}
          onChange={(path) => setProfile({ ...profile, profile_image: path })}
          accept="image/*"
        />
      </Card>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? "saving..." : "Save profile"}
        </Button>
        {saved && <span className="text-xs text-accent">Saved</span>}
      </div>
    </div>
  );
}
