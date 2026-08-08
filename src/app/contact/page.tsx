import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SocialLink } from "@/components/SocialIcon";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact — Naidrahiqa",
};

export default async function ContactPage() {
  const supabase = await createClient();

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("sort_order");

  return (
    <div className="flex flex-col gap-10 pt-12 sm:pt-16">
      <header>
        <p className="text-xs uppercase tracking-widest text-accent">
          Contact
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Let&apos;s <span className="gradient-text">connect</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Reach out — collaborations, questions, or just to talk about kernels,
          IoT, or security.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {contacts?.map((c) => (
          <SocialLink
            key={c.id}
            platform={c.platform}
            handle={c.handle}
            url={c.url}
          />
        ))}
      </div>
    </div>
  );
}
