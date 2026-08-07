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
      className="glass group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:border-border-hover hover:glow-accent hover:-translate-y-0.5"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-muted transition-all duration-300 group-hover:text-accent group-hover:bg-accent/15">
        <BrandIcon platform={platform} size={20} />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold capitalize">{platform}</span>
        <span className="block truncate text-xs text-muted">
          {handle || url}
        </span>
      </span>
    </a>
  );
}
