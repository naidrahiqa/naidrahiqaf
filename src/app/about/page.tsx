import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MarkdownContent } from "@/components/MarkdownContent";

export const metadata: Metadata = {
  title: "About",
  description: "About Faqih Ardian Syah — Naidrahiqa",
};

export default async function AboutPage() {
  const supabase = await createClient();

  const [{ data: profile }, { data: sections }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", 1).single(),
    supabase.from("about_sections").select("*").order("sort_order"),
  ]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-14 pt-12 sm:pt-16">
      <header>
        <p className="text-xs uppercase tracking-widest text-accent">
          About Me
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Who is <span className="gradient-text">Naidra</span>?
        </h1>
      </header>

      {profile && (
        <div className="glass glow-accent flex items-center gap-5 rounded-2xl p-5">
          {profile.profile_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profile_image}
              alt={profile.name}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-accent/20 ring-offset-2 ring-offset-background"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 text-xl font-bold text-accent ring-2 ring-accent/20 ring-offset-2 ring-offset-background">
              {profile.nickname?.charAt(0) ?? "N"}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted">{profile.tagline}</p>
          </div>
        </div>
      )}

      {sections?.map((section) => (
        <section key={section.id}>
          <h2 className="text-lg font-semibold">{section.heading}</h2>
          <div className="mt-3">
            <MarkdownContent content={section.content} />
          </div>
        </section>
      ))}
    </div>
  );
}
