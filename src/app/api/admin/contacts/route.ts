import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { dbError } from "@/lib/api";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("sort_order");

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await request.json().catch(() => []);
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "expected an array" }, { status: 400 });
  }

  const clean = items.map(
    (i: { platform?: string; handle?: string; url?: string; sort_order?: number }) => ({
      platform: i.platform ?? "email",
      handle: i.handle ?? "",
      url: i.url ?? "",
      sort_order: i.sort_order ?? 0,
    })
  );

  const supabase = await createClient();
  const { error } = await supabase.rpc("swap_contacts", { items: clean });

  if (error) return NextResponse.json({ error: dbError(error) }, { status: 500 });
  return NextResponse.json({ ok: true });
}