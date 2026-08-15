import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify, detectVideoType, getStoragePath } from "@/lib/utils";
import { dbError } from "@/lib/api";
import { pickFields, projectFields, achievementFields, nowPlayingFields } from "@/lib/admin-fields";

const entities = ["projects", "achievements", "now_playing"] as const;
type Entity = (typeof entities)[number];

const allowedFields: Record<Entity, readonly string[]> = {
  projects: projectFields,
  achievements: achievementFields,
  now_playing: nowPlayingFields,
};

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/admin/[entity]/[id]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entity, id } = await params;
  if (!entities.includes(entity as Entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(entity)
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/admin/[entity]/[id]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entity, id } = await params;
  if (!entities.includes(entity as Entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const payload = pickFields(body, allowedFields[entity as Entity]);
  delete payload.created_at;
  payload.updated_at = new Date().toISOString();
  if (entity === "projects") {
    if (payload.title) payload.slug = payload.slug ?? slugify(String(payload.title));
    if (payload.video_url !== undefined)
      payload.video_type = payload.video_type ?? detectVideoType(String(payload.video_url ?? null));
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(entity)
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

async function cleanupStorageFiles(supabase: Awaited<ReturnType<typeof createClient>>, urls: (string | null)[]) {
  const paths: string[] = [];
  for (const url of urls) {
    if (!url) continue;
    const path = getStoragePath(url);
    if (path) paths.push(path);
  }
  if (paths.length > 0) {
    await supabase.storage.from("media").remove(paths);
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/admin/[entity]/[id]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entity, id } = await params;
  if (!entities.includes(entity as Entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  }

  const supabase = await createClient();

  if (entity === "projects") {
    const { data: project } = await supabase
      .from("projects")
      .select("cover_image, video_url")
      .eq("id", id)
      .single();

    const { data: media } = await supabase
      .from("project_media")
      .select("url")
      .eq("project_id", id);

    const urls = [
      project?.cover_image,
      project?.video_url,
      ...(media?.map((m) => m.url) ?? []),
    ];
    await cleanupStorageFiles(supabase, urls);
  }

  const { error } = await supabase.from(entity).delete().eq("id", id);

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
