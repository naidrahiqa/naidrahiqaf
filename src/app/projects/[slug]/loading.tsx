export default function ProjectDetailLoading() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 pt-12 sm:pt-16">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />

      <header className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-surface-2" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-surface-2" />
        </div>
        <div className="h-9 w-3/4 animate-pulse rounded bg-surface-2" />
        <div className="h-5 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
      </header>

      <div className="aspect-video w-full animate-pulse overflow-hidden rounded-2xl border-2 border-foreground bg-surface-2" />

      <div className="flex flex-col gap-3">
        <div className="h-4 w-full animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-surface-2" />
        <div className="h-4 w-4/6 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}
