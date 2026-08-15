-- =============================================================
-- 012 — Tambah repo GitHub yang belum masuk ke portfolio (personal)
-- Jalankan di Supabase Dashboard > SQL Editor (setelah 001..011)
-- =============================================================

insert into public.projects (title, slug, category, description, content, link, published, sort_order)
values
  (
    'Aqua Safe Monitor Android',
    'aqua-safe-monitor-android',
    'personal',
    'Monitoring App Aqua Safe Monitor - Android Version',
    'Aplikasi monitoring untuk Aqua Safe Monitor, versi Android. [Lihat di GitHub](https://github.com/naidrahiqa/aqua-safe-monitor-android)',
    'https://github.com/naidrahiqa/aqua-safe-monitor-android',
    true,
    30
  ),
  (
    'ReSukiSU',
    'resukisu',
    'personal',
    'Fork SukiSU-Ultra - kernel root solution yang lebih stabil',
    'Fork dari SukiSU-Ultra, solusi root kernel yang lebih stabil untuk Android. [Lihat di GitHub](https://github.com/naidrahiqa/ReSukiSU)',
    'https://github.com/naidrahiqa/ReSukiSU',
    true,
    31
  ),
  (
    'KernelSU Next',
    'kernelsu-next',
    'personal',
    'Kernel-based root solution untuk Android (fork)',
    'Solusi root berbasis kernel untuk Android (fork). [Lihat di GitHub](https://github.com/naidrahiqa/KernelSU-Next)',
    'https://github.com/naidrahiqa/KernelSU-Next',
    true,
    32
  ),
  (
    'KTI Attendance System',
    'kti-attendance-system',
    'personal',
    'Absensi, manajemen kas & keaktifan KTI (Next.js + Google Sheets)',
    'Sistem absensi, manajemen kas, dan keaktifan KTI berbasis Next.js + Google Sheets. [Lihat di GitHub](https://github.com/naidrahiqa/kti-attendance-system)',
    'https://github.com/naidrahiqa/kti-attendance-system',
    true,
    33
  ),
  (
    'AnyKernel3',
    'anykernel3',
    'personal',
    'Flashable zip template untuk rilis kernel (fork osm0sis)',
    'Template zip flashable untuk rilis kernel (fork osm0sis). [Lihat di GitHub](https://github.com/naidrahiqa/AnyKernel3)',
    'https://github.com/naidrahiqa/AnyKernel3',
    true,
    34
  );
