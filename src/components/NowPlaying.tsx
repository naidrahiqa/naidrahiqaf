"use client";

import { useState } from "react";
import Image from "next/image";
import { Music } from "lucide-react";
import { resolveImageUrl } from "@/lib/utils";
import type { NowPlayingSong } from "@/lib/types";

type SongInput = Pick<
  NowPlayingSong,
  "title" | "artist" | "album" | "art_url" | "link"
>;

const FALLBACK: SongInput[] = [
  { title: "Daydream", artist: "Laufey", album: "Bewitched", art_url: "", link: "" },
  { title: "Pink + White", artist: "Frank Ocean", album: "Blonde", art_url: "", link: "" },
  { title: "Sunflower", artist: "Post Malone, Swae Lee", album: "Spider-Verse", art_url: "", link: "" },
  { title: "Watermelon Sugar", artist: "Harry Styles", album: "Fine Line", art_url: "", link: "" },
  { title: "Electric Feel", artist: "MGMT", album: "Oracular Spectacular", art_url: "", link: "" },
  { title: "Levitating", artist: "Dua Lipa", album: "Future Nostalgia", art_url: "", link: "" },
  { title: "Lover", artist: "Taylor Swift", album: "Lover", art_url: "", link: "" },
];

function pickSong(list: SongInput[]): SongInput {
  if (list.length === 0) return FALLBACK[0];
  return list[Math.floor(Date.now() / 86400000) % list.length];
}

export function NowPlaying({ song }: { song?: SongInput | null }) {
  const data = song ?? pickSong(FALLBACK);
  const [artError, setArtError] = useState(false);
  const art = data.art_url && !artError ? resolveImageUrl(data.art_url) : null;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  return (
    <div className="glass glow-accent relative overflow-hidden rounded-3xl p-5">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-fill/25 blur-xl sm:blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-28 w-28 rounded-full bg-accent-2-fill/25 blur-xl sm:blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
          <span className="flex h-3.5 items-end gap-0.5" aria-hidden>
            <span
              className="eq-bar block h-3.5 w-1 rounded-full bg-gradient-to-t from-accent to-accent-2"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="eq-bar block h-3.5 w-1 rounded-full bg-gradient-to-t from-accent to-accent-2"
              style={{ animationDelay: "180ms" }}
            />
            <span
              className="eq-bar block h-3.5 w-1 rounded-full bg-gradient-to-t from-accent to-accent-2"
              style={{ animationDelay: "360ms" }}
            />
            <span
              className="eq-bar block h-3.5 w-1 rounded-full bg-gradient-to-t from-accent to-accent-2"
              style={{ animationDelay: "120ms" }}
            />
          </span>
          Now Playing
        </div>
        {data.link && (
          <a
            href={data.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-glass-border bg-surface-2/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent transition-colors hover:text-accent-hover"
          >
            ▶ Open
          </a>
        )}
      </div>

      <div className="relative mt-4 flex gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-glass-border bg-surface-2">
          {art ? (
            <Image
              src={art}
              alt={data.title}
              width={96}
              height={96}
              className="h-full w-full object-cover"
              onError={() => setArtError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-fill to-accent-2-fill">
              <Music size={28} className="text-on-accent/70" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            Daily pick · {date}
          </p>
          <p className="mt-1 truncate font-display text-lg font-bold leading-tight">
            {data.title}
          </p>
          <p className="truncate text-sm text-muted">{data.artist}</p>
          {data.album && (
            <p className="truncate text-[11px] text-muted/80">{data.album}</p>
          )}
        </div>
      </div>

      <div className="relative mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-accent-fill to-accent-2-fill" />
        </div>
        <div className="mt-1 flex justify-between text-[10px] font-semibold uppercase tracking-wide text-muted">
          <span>on loop</span>
          <span>♡</span>
        </div>
      </div>
    </div>
  );
}
