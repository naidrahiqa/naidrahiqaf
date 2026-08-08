import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { slugify, detectVideoType } from "@/lib/utils";
import { pickFields, postFields, projectFields, achievementFields } from "@/lib/admin-fields";

const entities = ["posts", "projects", "achievements"] as const;
type Entity = (typeof entities)[number];

const allowedFields: Record<Entity, readonly string[]> = {
  posts: postFields,
  projects: projectFields,
  achievements: achievementFields,
};

const orderBy: Record<Entity, { column: string; ascending: boolean }> = {
  posts: { column: "created_at", ascending: false },
  projects: { column: "created_at", ascending: false },
  achievements: { column: "sort_order", ascending: true },
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
  if (entity !== "achievements") {
    payload.slug = body.slug?.trim() || slugify(body.title);
    payload.video_type =
      body.video_type ?? detectVideoType(body.video_url ?? null);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(entity)
    .insert(payload)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
