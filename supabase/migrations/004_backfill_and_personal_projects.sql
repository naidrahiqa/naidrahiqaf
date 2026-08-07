-- =============================================================
-- Naidrahiqa Portfolio — Backfill mapel + personal projects (20 repos)
-- Jalankan di Supabase Dashboard > SQL Editor
-- =============================================================

-- ---------- 1. Backfill subject (mapel) di data school yang sudah ada ----------
UPDATE public.projects SET subject = 'Produktif TKJ' WHERE slug = 'tjkn-kabel-jaringan';
UPDATE public.projects SET subject = 'Produktif TKJ' WHERE slug = 'kj-konfigurasi-jaringan';
UPDATE public.projects SET subject = 'Produktif TKJ' WHERE slug = 'asj-administrasi-sistem';

-- ---------- 2. Hapus placeholder lama ----------
DELETE FROM public.projects WHERE slug = 'personal-project';

-- ---------- 3. Insert personal projects dari GitHub (non-fork) ----------
INSERT INTO public.projects (title, slug, category, description, content, link, published) VALUES

('Oronyx Clang', 'oronyx-clang', 'personal',
 'Optimized LLVM/Clang toolchain (PGO, ThinLTO, BOLT) untuk custom kernel Android.',
 E'### Oronyx Clang\n\nToolchain LLVM/Clang yang dioptimasi khusus untuk kompilasi kernel Android.\n\n**Fitur:** PGO, ThinLTO, BOLT\n**Tech:** C, LLVM, Bash\n\n[GitHub](https://github.com/naidrahiqa/Oronyx_Clang)',
 'https://github.com/naidrahiqa/Oronyx_Clang', true),

('Phrolova Kernel (Xiaomi Selene)', 'phrolova-kernel-selene', 'personal',
 'Custom kernel Xiaomi Redmi 10 (selene) — vendor R, optimasi performa & battery.',
 E'### Phrolova Kernel\n\nCustom kernel untuk Xiaomi Redmi 10 (codename: selene) dengan optimasi performa dan daya tangan baterai.\n\n**Device:** Xiaomi Redmi 10 (selene)\n**Base:** vendor R\n\n[GitHub](https://github.com/naidrahiqa/phrolova_kernel_xiaomi_selene)',
 'https://github.com/naidrahiqa/phrolova_kernel_xiaomi_selene', true),

('Epitaph Kernel GKI (Xiaomi Fire)', 'epitaph-kernel-fire-gki', 'personal',
 'Custom kernel GKI 6.6 untuk Redmi 12 (fire) — optimasi gaming & daily use.',
 E'### Epitaph Kernel GKI\n\nCustom kernel berbasis GKI 6.6 untuk Xiaomi Redmi 12 (codename: fire).\n\n**Device:** Xiaomi Redmi 12 (fire)\n**GKI:** 6.6\n\n[GitHub](https://github.com/naidrahiqa/epitaph_kernel_xiaomi_fire_GKI)',
 'https://github.com/naidrahiqa/epitaph_kernel_xiaomi_fire_GKI', true),

('Pollux Kernel (Xiaomi Fire)', 'pollux-kernel-fire', 'personal',
 'Custom kernel Redmi 12 Fire T/U — MIUI 14 & HyperOS 1.',
 E'### Pollux Kernel\n\nCustom kernel untuk Xiaomi Redmi 12 (fire) yang mendukung MIUI 14 dan HyperOS 1.\n\n**Device:** Xiaomi Redmi 12 (fire)\n**Support:** MIUI 14 & HyperOS 1\n\n[GitHub](https://github.com/naidrahiqa/pollux_kernel_xiaomi_fire)',
 'https://github.com/naidrahiqa/pollux_kernel_xiaomi_fire', true),

('Multi-Audio', 'multi-audio', 'personal',
 'Concurrent audio playback dengan per-app volume via WebUI — KernelSU Next module.',
 E'### Multi-Audio\n\nKernelSU Next module: beberapa aplikasi memutar audio secara bersamaan dengan kontrol volume per-app.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/multi-audio)',
 'https://github.com/naidrahiqa/multi-audio', true),

('Evanescia Memory', 'evanescia-memory', 'personal',
 'Advanced VM tuning, ZRAM & memory optimization — KernelSU Next module.',
 E'### Evanescia Memory\n\nModul optimasi memori lanjutan: VM tuning, ZRAM configuration, dan memory management.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/evanescia-memory)',
 'https://github.com/naidrahiqa/evanescia-memory', true),

('Media Fix', 'media-fix', 'personal',
 'Video playback & codec optimization — KernelSU Next module.',
 E'### Media Fix\n\nOptimasi video playback dan codec untuk performa lebih baik.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/media-fix)',
 'https://github.com/naidrahiqa/media-fix', true),

('H-Thermal', 'h-thermal', 'personal',
 'Universal thermal control (Qualcomm & MediaTek) — KernelSU Next module.',
 E'### H-Thermal\n\nKontrol thermal universal untuk chipset Qualcomm dan MediaTek.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/h-thermal)',
 'https://github.com/naidrahiqa/h-thermal', true),

('Hyacine I/O', 'hyacine-io', 'personal',
 'Storage I/O & FUSE passthrough optimizer — KernelSU Next module.',
 E'### Hyacine I/O\n\nOptimizer untuk storage I/O dan FUSE passthrough.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/hyacine-io)',
 'https://github.com/naidrahiqa/hyacine-io', true),

('Spoof Fierce', 'spoof-fierce', 'personal',
 'Device spoofing & per-game FPS unlock (Zygisk, WebUI) — KernelSU Next module.',
 E'### Spoof Fierce\n\nDevice spoofing dan FPS unlock per-game via Zygisk dengan WebUI.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/spoof-fierce)',
 'https://github.com/naidrahiqa/spoof-fierce', true),

('Kairitsu Safe', 'kairitsu-safe', 'personal',
 'Bootloop protection, watchdog & crash prevention — KernelSU Next module.',
 E'### Kairitsu Safe\n\nPerlindungan bootloop, watchdog, dan crash prevention.\n\n**Device:** Redmi 12 (fire) & Redmi 10 (selene)\n\n[GitHub](https://github.com/naidrahiqa/kairitsu-safe)',
 'https://github.com/naidrahiqa/kairitsu-safe', true),

('SUSFS4KSU Legacy', 'susf4ksu-legacy', 'personal',
 'Backport SUSFS untuk kernel lawas (legacy/non-GKI).',
 E'### SUSFS4KSU Legacy\n\nBackport SUSFS (Suspicious Filesystem) untuk kernel yang belum support GKI.\n\n[GitHub](https://github.com/naidrahiqa/susf4ksu-legacy)',
 'https://github.com/naidrahiqa/susf4ksu-legacy', true),

('FetchVid', 'fetchvid', 'personal',
 'Batch downloader Reels/TikTok/Instagram — Go + Wails, single .exe.',
 E'### FetchVid\n\nDesktop app untuk download video dari Reels, TikTok, dan Instagram secara batch.\n\n**Tech:** Go + Wails\n**Output:** Single .exe\n\n[GitHub](https://github.com/naidrahiqa/FetchVid)',
 'https://github.com/naidrahiqa/FetchVid', true),

('Catchido', 'catchido', 'personal',
 'Scraper foto idol KR/CN/JP dengan dedup & organizer.',
 E'### Catchido\n\nTool untuk scrape foto dari berbagai sumber, dengan deduplication otomatis dan organizer.\n\n**Tech:** Python\n\n[GitHub](https://github.com/naidrahiqa/catchido)',
 'https://github.com/naidrahiqa/catchido', true),

('Reboisasi', 'reboisasi', 'personal',
 'Aplikasi reboisasi — JavaScript web app untuk monitoring penanaman pohon.',
 E'### Reboisasi\n\nWeb app untuk monitoring dan manajemen program reboisasi.\n\n**Tech:** JavaScript\n\n[GitHub](https://github.com/naidrahiqa/reboisasi)',
 'https://github.com/naidrahiqa/reboisasi', true),

('Kasirin Aja', 'kasirin-aja', 'personal',
 'POS web (Laravel) untuk manajemen produk & transaksi kasir.',
 E'### Kasirin Aja\n\nPoint of Sale web app untuk manajemen produk dan transaksi kasir.\n\n**Tech:** Laravel (PHP), MySQL\n\n[GitHub](https://github.com/naidrahiqa/kasirin_aja)',
 'https://github.com/naidrahiqa/kasirin_aja', true),

('Aqua Safe Monitor', 'aqua-safe-monitor', 'personal',
 'WebApp monitoring OPSI 2026.',
 E'### Aqua Safe Monitor\n\nWeb application untuk monitoring sistem OPSI.\n\n[GitHub](https://github.com/naidrahiqa/aqua_safe_monitor_opsi_2026)',
 'https://github.com/naidrahiqa/aqua_safe_monitor_opsi_2026', true),

('LKS ITNSA 2026', 'lks-itnsa-2026', 'personal',
 'LKS SMK Ke-34 Kab. Jepara — IT Network System Administration.',
 E'### LKS ITNSA 2026\n\nKompetisi LKS bidang IT Network System Administration tingkat kabupaten.\n\n[GitHub](https://github.com/naidrahiqa/LKS-SMK-Ke-34-KAB.JEPARA-ITNSA.)',
 'https://github.com/naidrahiqa/LKS-SMK-Ke-34-KAB.JEPARA-ITNSA.', true),

('ScoreWave', 'scorewave', 'personal',
 '#juaravibecoding',
 '### ScoreWave\n\n[GitHub](https://github.com/naidrahiqa/ScoreWave)',
 'https://github.com/naidrahiqa/ScoreWave', true),

('Naidrahiqa.github.io', 'naidrahiqa-github-io', 'personal',
 'Personal portfolio site — versi lama sebelum rebuild ke Next.js.',
 E'### Naidrahiqa.github.io\n\nPortfolio site lama yang dibangun dengan GitHub Pages.\n\n[GitHub](https://github.com/naidrahiqa/naidrahiqa.github.io)',
 'https://github.com/naidrahiqa/naidrahiqa.github.io', true)

ON CONFLICT (slug) DO NOTHING;
