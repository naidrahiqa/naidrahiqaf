import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify, detectVideoType } from "@/lib/utils";

const entities = ["posts", "projects", "achievements"] as const;
type Entity = (typeof entities)[number];

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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
  const payload: Record<string, unknown> = { ...body };
  delete payload.id;
  delete payload.created_at;
  payload.updated_at = new Date().toISOString();
  if (entity !== "achievements") {
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
  const { error } = await supabase.from(entity).delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
