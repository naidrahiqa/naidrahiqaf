import { BrandIcon } from "@/components/BrandIcon";

export function SocialIcon({
  platform,
  size = 18,
}: {
  platform: string;
  size?: number;
}) {
  return <BrandIcon platform={platform} size={size} />;
}

export function SocialLink({
  platform,
  handle,
  url,
}: {
  platform: string;
  handle: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border-2 border-foreground bg-surface p-4 hard-shadow-sm transition-all duration-200 hover:-translate-y-1 hover:hard-shadow-hover"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-foreground bg-accent text-on-accent transition-transform duration-200 group-hover:rotate-6 group-hover:scale-105">
        <BrandIcon platform={platform} size={20} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold uppercase tracking-wide">{platform}</span>
        <span className="block truncate text-xs font-semibold text-muted">
          {handle || url}
        </span>
      </span>
    </a>
  );
}