"use client";

import { useState } from "react";
import { Award, ExternalLink, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { AchievementBadge } from "@/components/cards";
import { PDFThumbnail } from "@/components/PDFThumbnail";
import type { Achievement } from "@/lib/types";

const filters = [
  { key: "all", label: "All" },
  { key: "competition", label: "Competitions" },
  { key: "training", label: "Trainings" },
  { key: "seminar", label: "Seminars" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

function isLocalPath(url: string): boolean {
  return url.startsWith("media/");
}

function isPdfUrl(url: string): boolean {
  if (isLocalPath(url)) return url.endsWith(".pdf");
  return /\.pdf(\?.*)?$/i.test(url);
}

function isImageUrl(url: string): boolean {
  if (isLocalPath(url)) return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);
  if (/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)) return true;
  if (url.includes("lh3.googleusercontent.com/d/")) return true;
  if (url.includes("drive.google.com")) return true;
  return false;
}

function getViewUrl(certificateUrl: string, directUrl: string): string {
  if (certificateUrl.includes("drive.google.com")) return certificateUrl;
  return directUrl;
}

function getSupabaseUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/media/${path.replace(/^media\//, "")}`;
}

export function AchievementFilter({ items }: { items: Achievement[] }) {
  const [active, setActive] = useState<FilterKey>("all");

  const filtered =
    active === "all" ? items : items.filter((a) => a.category === active);

  function renderThumbnail(a: Achievement) {
    if (!a.certificate_url) return null;
    
    const directUrl = isLocalPath(a.certificate_url) 
      ? getSupabaseUrl(a.certificate_url) 
      : a.certificate_url.includes("lh3.googleusercontent.com/d/")
        ? a.certificate_url
        : a.certificate_url;
    const viewUrl = getViewUrl(a.certificate_url, directUrl);

    if (isPdfUrl(a.certificate_url)) {
      return (
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-[3/2] overflow-hidden border-b-2 border-foreground bg-surface-2"
        >
          <PDFThumbnail url={directUrl} className="h-full w-full" />
        </a>
      );
    }
    
    if (isImageUrl(a.certificate_url)) {
      return (
        <a
          href={viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block aspect-[3/2] overflow-hidden border-b-2 border-foreground bg-surface-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={directUrl}
            alt={a.title}
            className="h-full w-full object-cover"
          />
        </a>
      );
    }

    return (
      <a
        href={viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-[3/2] items-center justify-center gap-2 border-b-2 border-foreground bg-surface-2 text-muted transition-colors hover:text-accent"
      >
        <FileText size={24} />
        <span className="text-xs font-bold uppercase">View Certificate</span>
        <ExternalLink size={12} />
      </a>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2.5">
        {filters.map((f, i) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={cn(
              "rounded-full border-2 border-foreground px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition-all duration-200",
              active === f.key
                ? "bg-accent text-on-accent -rotate-1 hard-shadow-sm"
                : "bg-surface text-muted hover:rotate-1 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "mr-1.5",
                active === f.key ? "text-on-accent/70" : "text-accent"
              )}
            >
              {String(i + 1).padStart(2, "0")}.
            </span>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {filtered.map((a, i) => (
          <div
            key={a.id}
            className="flex flex-col gap-3 rounded-xl border-2 border-foreground bg-surface hard-shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:hard-shadow-hover"
          >
            {renderThumbnail(a)}
            <div className="p-5">
              <div className="flex items-center justify-between gap-3">
                <AchievementBadge category={a.category} />
                <span className="font-display text-xs font-bold text-foreground">
                  {a.year}
                </span>
              </div>
              <div className="flex items-start gap-3 mt-2">
                <span className="mt-0.5 font-display text-sm font-extrabold text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display font-bold uppercase leading-snug tracking-tight">
                    {a.title}
                  </h3>
                  {a.event && <p className="mt-1 text-sm text-muted">{a.event}</p>}
                </div>
              </div>
              {a.description && (
                <p className="text-sm leading-relaxed text-muted">{a.description}</p>
              )}
              {a.certificate_url && (
                <a
                  href={getViewUrl(a.certificate_url, isLocalPath(a.certificate_url) ? getSupabaseUrl(a.certificate_url) : a.certificate_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-accent transition-colors hover:underline"
                >
                  <Award size={13} />
                  Certificate
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
