import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-12 text-center">
      <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
        404
      </h1>
      <p className="max-w-sm text-sm text-muted">
        Halaman yang kamu cari gak ada atau sudah dipindah.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background transition-all duration-200 hover:bg-accent/90 hover:-translate-y-0.5"
      >
        Go Home
      </Link>
    </div>
  );
}
