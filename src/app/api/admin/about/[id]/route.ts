import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { pickFields, aboutFields } from "@/lib/admin-fields";
import { dbError } from "@/lib/api";

export async function PUT(
  request: Request,
  { params }: RouteContext<"/api/admin/about/[id]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));

  const supabase = await createClient();
  const payload = pickFields(body, aboutFields);
  payload.updated_at = new Date().toISOString();
  const { data, error } = await supabase
    .from("about_sections")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext<"/api/admin/about/[id]">
) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("about_sections").delete().eq("id", id);

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}
