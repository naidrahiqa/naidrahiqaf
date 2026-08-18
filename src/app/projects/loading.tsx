export default function ProjectsLoading() {
  return (
    <div className="flex flex-col gap-16 pt-12 sm:pt-16">
      <header className="max-w-2xl">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-surface-2" />
        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-surface-2" />
      </header>

      <section className="flex flex-col gap-6">
        <div>
          <div className="h-3 w-12 animate-pulse rounded bg-surface-2" />
          <div className="mt-1 h-6 w-32 animate-pulse rounded bg-surface-2" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border-2 border-foreground bg-surface"
            >
              <div className="aspect-video animate-pulse bg-surface-2" />
              <div className="p-4">
                <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
                <div className="mt-2 h-5 w-3/4 animate-pulse rounded bg-surface-2" />
                <div className="mt-2 h-3 w-full animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
