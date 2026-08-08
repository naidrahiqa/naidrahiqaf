import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SocialIcon } from "@/components/SocialIcon";

export default async function Footer() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("sort_order");

  return (
    <footer className="mt-auto border-t border-border/50 bg-surface/20 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-sm font-bold uppercase gradient-text">
            naidrahiqa
          </p>
          <p className="mt-1 text-xs text-muted">
            Kernel Developer · IoT Builder · CyberSecurity Enthusiast
          </p>
        </div>

        <div className="flex items-center gap-2">
          {contacts?.map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${c.platform} — ${c.handle}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted backdrop-blur-sm transition-all duration-200 hover:text-accent hover:border-border-hover hover:-translate-y-0.5"
            >
              <SocialIcon platform={c.platform} size={17} />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} naidrahiqa</span>
        </div>
      </div>
    </footer>
  );
}
