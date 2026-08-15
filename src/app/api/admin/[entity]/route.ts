import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify, detectVideoType } from "@/lib/utils";
import { dbError } from "@/lib/api";
import { pickFields, projectFields, achievementFields, nowPlayingFields } from "@/lib/admin-fields";

const entities = ["projects", "achievements", "now_playing"] as const;
type Entity = (typeof entities)[number];

const allowedFields: Record<Entity, readonly string[]> = {
  projects: projectFields,
  achievements: achievementFields,
  now_playing: nowPlayingFields,
};

const orderBy: Record<Entity, { column: string; ascending: boolean }> = {
  projects: { column: "sort_order", ascending: true },
  achievements: { column: "sort_order", ascending: true },
  now_playing: { column: "sort_order", ascending: true },
};

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/admin/[entity]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entity } = await params;
  if (!entities.includes(entity as Entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  }

  const supabase = await createClient();
  const { column, ascending } = orderBy[entity as Entity];
  const { data, error } = await supabase
    .from(entity)
    .select("*")
    .order(column, { ascending });

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/admin/[entity]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entity } = await params;
  if (!entities.includes(entity as Entity)) {
    return NextResponse.json({ error: "Unknown entity" }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  if (!body.title || typeof body.title !== "string") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  const payload = pickFields(body, allowedFields[entity as Entity]);
  payload.title = body.title;
  if (entity === "projects") {
    payload.slug = body.slug?.trim() || slugify(body.title);
    payload.video_type =
      body.video_type ?? detectVideoType(body.video_url ?? null);
  }

  const supabase = await createClient();

  if (entity === "projects") {
    const { data: maxRow } = await supabase
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    payload.sort_order = (maxRow?.sort_order ?? 0) + 1;
  }

  if (entity === "projects" && payload.slug) {
    const { data: existing } = await supabase
      .from("projects")
      .select("id")
      .eq("slug", payload.slug)
      .limit(1)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }
  }

  const { data, error } = await supabase
    .from(entity)
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
