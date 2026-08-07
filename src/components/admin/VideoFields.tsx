"use client";

import { Wand2 } from "lucide-react";
import { detectVideoType } from "@/lib/utils";
import { Input, Label, Select } from "@/components/admin/ui";

const videoTypes = ["none", "youtube", "drive", "storage"] as const;

export function VideoFields({
  url,
  type,
  onChange,
}: {
  url: string | null | undefined;
  type: string | null | undefined;
  onChange: (fields: { video_url: string | null; video_type: string }) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="video_url">video url</Label>
          <button
            type="button"
            onClick={() =>
              onChange({
                video_url: url ?? null,
                video_type: detectVideoType(url ?? null),
              })
            }
            className="mb-1.5 inline-flex items-center gap-1 font-mono text-[11px] text-accent transition-colors hover:underline"
          >
            <Wand2 size={11} />
            auto-detect
          </button>
        </div>
        <Input
          id="video_url"
          type="url"
          placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/d/... or media/xxx.mp4"
          value={url ?? ""}
          onChange={(e) =>
            onChange({
              video_url: e.target.value || null,
              video_type: type ?? "none",
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="video_type">video type</Label>
        <Select
          id="video_type"
          value={type ?? "none"}
          onChange={(e) =>
            onChange({ video_url: url ?? null, video_type: e.target.value })
          }
        >
          {videoTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
