export default function SchoolSubjectLoading() {
  return (
    <div className="flex flex-col gap-10 pt-12 sm:pt-16">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />

      <header className="max-w-2xl">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-2" />
        <div className="mt-2 h-8 w-48 animate-pulse rounded bg-surface-2" />
        <div className="mt-3 h-4 w-24 animate-pulse rounded bg-surface-2" />
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border-2 border-foreground bg-surface"
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
    </div>
  );
}
