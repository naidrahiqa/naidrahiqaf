import type { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { resolveImageUrl } from "@/lib/utils";
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
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-accent-fill/30 blur-2xl md:blur-3xl" />
        <div className="absolute -right-20 top-40 h-80 w-80 rounded-full bg-accent-2-fill/30 blur-2xl md:blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-12 pt-12 sm:pt-16">
        <header className="flex flex-col gap-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">
            About Me
          </p>
          <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
            Who is <span className="gradient-text">Naidra</span>?
          </h1>

          {profile && (
            <div className="glass glow-accent flex flex-col items-center gap-5 rounded-3xl p-6 sm:flex-row sm:items-center sm:gap-6">
              {profile.profile_image ? (
                <Image
                  src={resolveImageUrl(profile.profile_image)}
                  alt={profile.name}
                  width={112}
                  height={112}
                  className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-2 ring-accent/30 ring-offset-2 ring-offset-background"
                />
              ) : (
                <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent-2/20 text-3xl font-bold text-accent ring-2 ring-accent/30 ring-offset-2 ring-offset-background">
                  {profile.nickname?.charAt(0) ?? "N"}
                </div>
              )}
              <div className="min-w-0 text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold">
                  {profile.name}
                </h2>
                <p className="mt-1 text-muted">{profile.tagline}</p>
              </div>
            </div>
          )}
        </header>

        <div className="flex flex-col gap-6">
          {sections?.map((section) => (
            <section
              key={section.id}
              className="glass rounded-2xl p-6 transition-colors hover:border-accent/30"
            >
              <h2 className="font-display text-xl font-bold tracking-tight">
                {section.heading}
              </h2>
              <div className="mt-3">
                <MarkdownContent content={section.content} />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;
