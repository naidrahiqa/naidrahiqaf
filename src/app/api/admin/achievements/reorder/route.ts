import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { dbError, unauthorized } from "@/lib/api";

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return unauthorized();

  const body = await req.json();
  const orderedIds: string[] = Array.isArray(body?.orderedIds)
    ? body.orderedIds
    : [];

  if (orderedIds.length === 0)
    return NextResponse.json({ error: "No ids provided" }, { status: 400 });

  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("achievements").update({ sort_order: index + 1 }).eq("id", id)
  );

  const results = await Promise.all(updates);
  const firstError = results.find((r) => r.error);
  if (firstError?.error)
    return NextResponse.json({ error: dbError(firstError.error) }, { status: 500 });

  return NextResponse.json({ ok: true });
}
