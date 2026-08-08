import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { dbError } from "@/lib/api";
import type { ProjectMediaInsert } from "@/lib/types";

const mediaTypes = ["image", "youtube", "drive", "storage"] as const;

export async function GET(
  _request: Request,
  { params }: RouteContext<"/api/admin/projects/[id]/media">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", id)
    .order("sort_order");

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/admin/projects/[id]/media">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? body.items : [];

  for (const item of items) {
    if (
      !mediaTypes.includes(item.media_type) ||
      typeof item.url !== "string" ||
      !item.url.trim()
    ) {
      return NextResponse.json(
        { error: "Invalid media item" },
        { status: 400 }
      );
    }
  }

  const rows: ProjectMediaInsert[] = items.map(
    (item: { media_type: string; url: string; caption?: string }, i: number) => ({
      media_type: item.media_type,
      url: item.url.trim(),
      caption: item.caption ?? "",
      sort_order: i,
    })
  );

  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("project_media")
    .delete()
    .eq("project_id", id);
  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from("project_media")
      .insert(rows.map((row) => ({ ...row, project_id: id })));
    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("project_media")
    .select("*")
    .eq("project_id", id)
    .order("sort_order");
  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });

  return NextResponse.json(data);
}
