"use client";

import { useEffect, useState } from "react";
import type { NowPlayingSong } from "@/lib/types";
import {
  Button,
  Card,
  Input,
  Label,
} from "@/components/admin/ui";
import { useToast } from "@/components/admin/Toast";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { FileUpload } from "@/components/admin/FileUpload";

export default function NowPlayingAdminPage() {
  const { toast } = useToast();
  const [songs, setSongs] = useState<NowPlayingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/now_playing")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSongs(data);
        else throw new Error(data.error ?? "Failed to load");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function update(id: string, patch: Partial<NowPlayingSong>) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function save(id: string) {
    const song = songs.find((s) => s.id === id);
    if (!song) return;
    setSavingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/now_playing/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: song.title,
          artist: song.artist,
          album: song.album,
          art_url: song.art_url,
          link: song.link,
          sort_order: song.sort_order,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Save failed");
      }
      toast("success", "Saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSavingId(null);
    }
  }

  async function addSong() {
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/now_playing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Song",
          artist: "",
          album: "",
          art_url: "",
          link: "",
          sort_order: songs.length,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Add failed");
      }
      await load();
      toast("success", "Song added");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Add failed");
    } finally {
      setAdding(false);
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/now_playing/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Delete failed");
      }
      await load();
      toast("success", "Deleted");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Now Playing</h1>
        <p className="mt-2 text-sm text-muted">
          Lagu yang tampil di card home — rotasi otomatis tiap hari. Urutan
          diambil dari kolom sort (1, 2, 3…). Tiap lagu bisa pakai link bebas
          (Spotify / YouTube / url apa aja). Untuk cover, upload ke Supabase
          (paling reliable) atau paste URL — URL dari situs yang blokir
          hotlink (mis. kpopping) tidak akan tampil.
        </p>
      </header>

      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4">
        {songs.map((s) => (
          <Card key={s.id} className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-glass-border bg-surface-2">
                {s.art_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.art_url}
                    alt={s.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl text-muted">
                    ♪
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg font-bold">{s.title || "Untitled"}</p>
                <p className="truncate text-sm text-muted">{s.artist || "—"}</p>
                {s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-[11px] font-semibold text-accent hover:underline"
                  >
                    {s.link}
                  </a>
                )}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor={`title-${s.id}`}>Title</Label>
                <Input
                  id={`title-${s.id}`}
                  value={s.title}
                  onChange={(e) => update(s.id, { title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`artist-${s.id}`}>Artist</Label>
                <Input
                  id={`artist-${s.id}`}
                  value={s.artist}
                  onChange={(e) => update(s.id, { artist: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor={`album-${s.id}`}>Album</Label>
                <Input
                  id={`album-${s.id}`}
                  value={s.album}
                  onChange={(e) => update(s.id, { album: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <FileUpload
                  label="Art URL (upload ke Supabase atau paste URL)"
                  value={s.art_url || ""}
                  onChange={(v) => update(s.id, { art_url: v ?? "" })}
                  accept="image/*"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor={`link-${s.id}`}>Link (Spotify / YouTube / bebas)</Label>
                <Input
                  id={`link-${s.id}`}
                  value={s.link}
                  onChange={(e) => update(s.id, { link: e.target.value })}
                  placeholder="https://open.spotify.com/track/…"
                />
              </div>
              <div className="w-24">
                <Label htmlFor={`sort-${s.id}`}>Sort</Label>
                <Input
                  id={`sort-${s.id}`}
                  type="number"
                  value={s.sort_order}
                  onChange={(e) =>
                    update(s.id, { sort_order: Number(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => save(s.id)}
                disabled={savingId === s.id}
              >
                {savingId === s.id ? "Saving…" : "Save"}
              </Button>
              <DeleteButton entity="now_playing" id={s.id} name={s.title} />
            </div>
          </Card>
        ))}
      </div>

      <div>
        <Button type="button" onClick={addSong} disabled={adding}>
          {adding ? "Adding…" : "+ Add Song"}
        </Button>
      </div>
    </div>
  );
}
