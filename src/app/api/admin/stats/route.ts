import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const [posts, projects, achievements, about, contacts] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("achievements").select("id", { count: "exact", head: true }),
    supabase.from("about_sections").select("id", { count: "exact", head: true }),
    supabase.from("contacts").select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    posts: posts.count ?? 0,
    projects: projects.count ?? 0,
    achievements: achievements.count ?? 0,
    about: about.count ?? 0,
    contacts: contacts.count ?? 0,
  });
}
