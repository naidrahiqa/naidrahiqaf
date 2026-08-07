# Deploy Guide — naidra

## 1. Buat Supabase Project

1. Buka https://supabase.com → **New project** (free tier cukup).
2. Catat **Project URL** dan **anon public key** dari *Project Settings → API*.

## 2. Jalankan Migrasi

1. Buka **SQL Editor** di dashboard Supabase.
2. Paste isi `supabase/migrations/001_init.sql` → **Run**.
3. Paste isi `supabase/migrations/002_seed.sql` → **Run** (berisi profile, about sections, 7 contacts, 6 projects, 7 achievements, 2 posts dari Google Sites).

## 3. Buat User Admin

Di **Authentication → Users → Add user**, buat akun email + password (mis. `admin@naidra.dev`). Ini dipakai login di `/admin/login`.

## 4. Isi Environment

Edit `.env.local` (jangan pernah di-commit — sudah ada di .gitignore):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## 5. Verifikasi Lokal

```bash
npm run dev
```

Buka `http://localhost:3000` (cek halaman publik) dan `http://localhost:3000/admin/login` (login pakai akun admin).

## 6. Deploy ke Vercel

```bash
git add .
git commit -m "feat: naidra portfolio + admin panel"
git branch -M main
git remote add origin https://github.com/<user>/naidra.git
git push -u origin main
```

1. Buka https://vercel.com/new → import repo.
2. Tambahkan environment variables yang sama seperti `.env.local` (Settings → Environment Variables).
3. **Deploy**. Project URL di Vercel harus sama persis dengan Project URL Supabase (biarkan default, Jangan centang "Deploy a static site" — ini project Next.js).

## Catatan

- Semua halaman server-rendered (dynamic), jadi konten baru langsung muncul setelah edit di `/admin` — tidak perlu redeploy.
- Video: dukung URL YouTube, Google Drive (format `drive.google.com/file/d/<id>` atau `/uc?id=`), dan file di bucket `media`.
- Upload gambar/video via admin tersimpan di Storage bucket `media` (public, RLS: authenticated write).
