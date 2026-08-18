export default function SchoolClassLoading() {
  return (
    <div className="flex flex-col gap-10 pt-12 sm:pt-16">
      <div className="h-4 w-24 animate-pulse rounded bg-surface-2" />

      <header className="max-w-2xl">
        <div className="h-3 w-12 animate-pulse rounded bg-surface-2" />
        <div className="mt-2 h-8 w-48 animate-pulse rounded bg-surface-2" />
        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-surface-2" />
      </header>

      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border-2 border-foreground bg-surface px-5 py-4"
          >
            <div>
              <div className="h-5 w-40 animate-pulse rounded bg-surface-2" />
              <div className="mt-1 h-3 w-20 animate-pulse rounded bg-surface-2" />
            </div>
            <div className="h-4 w-4 animate-pulse rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
