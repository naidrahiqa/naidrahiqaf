export default function AboutLoading() {
  return (
    <div className="relative">
      <div className="mx-auto flex max-w-3xl flex-col gap-12 pt-12 sm:pt-16">
        <header className="flex flex-col gap-6">
          <div className="h-3 w-20 animate-pulse rounded bg-surface-2" />
          <div className="h-10 w-64 animate-pulse rounded bg-surface-2" />

          <div className="glass flex items-center gap-6 rounded-3xl p-6">
            <div className="h-28 w-28 shrink-0 animate-pulse rounded-2xl bg-surface-2" />
            <div className="flex-1">
              <div className="h-6 w-40 animate-pulse rounded bg-surface-2" />
              <div className="mt-2 h-4 w-56 animate-pulse rounded bg-surface-2" />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <div className="h-5 w-48 animate-pulse rounded bg-surface-2" />
              <div className="mt-3 flex flex-col gap-2">
                <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-surface-2" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
