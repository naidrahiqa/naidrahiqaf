import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard, AchievementBadge } from "@/components/cards";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: profile }, { data: projects }, { data: achievements }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", 1).single(),
      supabase
        .from("projects")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("achievements")
        .select("*")
        .order("sort_order")
        .limit(4),
    ]);

  return (
    <div className="flex flex-col gap-24 pt-14 sm:pt-20">
      {/* HERO */}
      <section className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Ambient orbs */}
        <div className="orb orb-accent -top-40 -left-40 h-80 w-80" />
        <div className="orb orb-pink top-20 -right-20 h-60 w-60" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs text-accent">
            <Sparkles size={12} />
            Open to collaborations
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground">Hi, I&apos;m </span>
            <span className="gradient-text">{profile?.nickname ?? "Naidra"}</span>
          </h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {(profile?.tagline ?? "")
              .split("|")
              .map((t: string) => t.trim())
              .filter(Boolean)
              .map((t: string) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted backdrop-blur-sm"
                >
                  {t}
                </span>
              ))}
          </div>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
            {profile?.hero_description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5"
            >
              View Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-6 py-3 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:border-border-hover hover:text-accent hover:-translate-y-0.5"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="relative">
          <div className="orb orb-accent -top-20 -right-20 h-40 w-40" />
          <div className="glass glow-accent-strong relative overflow-hidden rounded-2xl p-6 sm:p-8">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent-2/20 text-2xl font-bold text-accent ring-2 ring-accent/20 ring-offset-2 ring-offset-background">
                  {(profile?.nickname ?? "N").charAt(0)}
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-background bg-green-500 text-[8px] text-white">
                  ✓
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{profile?.nickname}</h2>
              <p className="mt-1 text-sm text-muted">{profile?.tagline?.split("|")[0]?.trim()}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">Kernel Dev</span>
                <span className="rounded-full bg-accent-2/10 px-3 py-1 text-xs text-accent-2">IoT</span>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Projects</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Work
            </h2>
          </div>
          <Link
            href="/projects"
            className="group text-sm text-muted transition-colors hover:text-accent"
          >
            View all
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent">Achievements</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Recent Awards
            </h2>
          </div>
          <Link
            href="/achievements"
            className="group text-sm text-muted transition-colors hover:text-accent"
          >
            View all
            <span className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {achievements?.map((a) => (
            <div
              key={a.id}
              className="glass group flex flex-col gap-3 rounded-xl p-5 transition-all duration-300 hover:border-border-hover hover:glow-accent"
            >
              <div className="flex items-center justify-between gap-3">
                <AchievementBadge category={a.category} />
                <span className="text-xs text-muted">{a.year}</span>
              </div>
              <h3 className="font-semibold leading-snug">{a.title}</h3>
              <p className="text-sm text-muted">{a.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="glass glow-accent relative overflow-hidden rounded-2xl p-8 text-center sm:p-12">
        <div className="orb orb-accent -top-20 left-1/2 h-40 w-60 -translate-x-1/2" />
        <div className="orb orb-pink -bottom-10 right-0 h-32 w-40" />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Let&apos;s <span className="gradient-text">connect</span>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">
            Interested in systems programming, IoT, or cybersecurity? My inbox is
            always open.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-0.5"
          >
            Contact Me
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
