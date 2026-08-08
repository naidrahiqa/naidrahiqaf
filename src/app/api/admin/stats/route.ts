import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";
import { dbError } from "@/lib/api";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const [projects, achievements, about, contacts] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
    supabase.from("about_sections").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
  ]);

  if ([projects, achievements, about, contacts].some((r) => r.error)) {
    return NextResponse.json({ error: dbError("stats failed") }, { status: 500 });
  }

  return NextResponse.json({
    projects: projects.count ?? 0,
    achievements: achievements.count ?? 0,
    about: about.count ?? 0,
    contacts: contacts.count ?? 0,
  });
}
