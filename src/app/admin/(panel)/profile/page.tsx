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
import { useToast } from "@/components/admin/Toast";

export default function ProfileEditorPage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      toast("success", "Profile saved");
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
        <p className="mt-2 text-sm text-muted">
          Your personal information shown on the homepage and about page.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <Card className="flex flex-col gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
          />
          <p className="mt-0.5 text-[10px] text-muted">
            Displayed in the hero section and page title (e.g. "FAQIH ARDIAN SYAH")
          </p>
        </div>
        <div>
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            value={profile.nickname}
            onChange={(e) =>
              setProfile({ ...profile, nickname: e.target.value })
            }
          />
          <p className="mt-0.5 text-[10px] text-muted">
            Shown as "Naidrahiqa" in the UI — your casual/brand name
          </p>
        </div>
        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={profile.tagline}
            onChange={(e) =>
              setProfile({ ...profile, tagline: e.target.value })
            }
            placeholder="TKJ Student | Kernel Developer | IoT Builder"
          />
          <p className="mt-0.5 text-[10px] text-muted">
            Pipe-separated roles shown below your name on the homepage
          </p>
        </div>
        <div>
          <Label htmlFor="hero">Hero Description</Label>
          <TextArea
            id="hero"
            rows={3}
            value={profile.hero_description}
            onChange={(e) =>
              setProfile({ ...profile, hero_description: e.target.value })
            }
          />
          <p className="mt-0.5 text-[10px] text-muted">
            Short bio shown in the hero section of the homepage
          </p>
        </div>
        <FileUpload
          label="Profile Image"
          value={profile.profile_image}
          onChange={(path) => setProfile({ ...profile, profile_image: path })}
          accept="image/*"
        />
      </Card>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}