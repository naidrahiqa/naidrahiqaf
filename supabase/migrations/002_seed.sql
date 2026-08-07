-- =============================================================
-- Naidrahiqa Portfolio — Seed data (dari Google Sites)
-- Jalankan SETELAH 001_init.sql
-- =============================================================

-- ---------- PROFILE ----------
insert into public.profiles (id, name, nickname, tagline, hero_description)
values (
  1,
  'Faqih Ardian Syah',
  'Naidrahiqa',
  'TKJ Student | Kernel Developer | IoT Builder | CyberSecurity Enthusiast',
  'Diving deep into Linux kernel optimization, embedded systems, and cybersecurity. Building competition-grade hardware and software solutions.'
)
on conflict (id) do nothing;

-- ---------- ABOUT SECTIONS ----------
insert into public.about_sections (key, heading, content, sort_order) values
('who_am_i', 'Who I Am', E'Hi, I''m Faqih Ardian Syah (often just "Mbah").\n\nI''m a TKJ student from Jepara, Indonesia, obsessed with low-level systems, IoT hardware, and cybersecurity. I spend my time building things that work, breaking things to understand how they work, and sharing what I learn.', 1),
('what_i_do', 'What I Do', E'By day, I''m a student competing in research olympiads and cybersecurity contests. By whenever, I''m:\n\n- Developing custom Linux kernels for mobile devices\n- Building IoT solutions that solve real problems\n- Competing in CTF competitions\n- Writing code that''s actually useful', 2),
('philosophy', 'My Philosophy', E'**1. Write Code That Works**\n\nNot "eventually," not "sometimes" — code should be reliable, predictable, and maintainable. Cut scope, not quality.\n\n**2. Learn By Breaking Things**\n\nThe best way to understand a system is to break it intentionally, then fix it. Reading documentation helps, but hands-on experience teaches.\n\n**3. Share Knowledge**\n\nIf I learned it the hard way, someone else doesn''t have to. Documentation, writeups, and open-source contributions benefit the community.\n\n**4. Compete, But Don''t Compromise**\n\nCompetition drives excellence. But not at the cost of ethical standards or community trust.', 3),
('interests', 'Interests Beyond Code', E'- **Gaming**: Zenless Zone Zero, Wuthering Waves, Roblox (casual)\n- **Networking**: Building communities (Discord)\n- **Learning**: Statistics, mathematics, networking theory\n- **Teaching**: Mentoring younger developers in security & systems programming', 4),
('current_focus', 'Current Focus', E'- Bringing Aqua Safe Monitor to competition stage (OPSI 2026)\n- Optimizing Phrolova Kernel for stability & performance\n- Exploring AI-assisted development workflows\n- Contributing to open-source kernel projects', 5),
('whats_next', 'What''s Next?', E'I''m always interested in:\n\n- Collaborating on challenging projects\n- Learning from experienced developers\n- Contributing to open-source communities\n- Exploring new hardware platforms\n- Building tools that solve real problems\n\nFeel free to reach out if you share these interests or want to discuss systems programming, IoT, cybersecurity, or anything technical!', 6)
on conflict (key) do nothing;

-- ---------- CONTACTS ----------
insert into public.contacts (platform, handle, url, sort_order) values
('instagram', '@naidrahiqa', 'https://instagram.com/naidrahiqa', 1),
('threads', '@naidrahiqa', 'https://threads.net/@naidrahiqa', 2),
('discord', '@naidrahiqa', 'https://discord.com/users/naidrahiqa', 3),
('linkedin', '@naidrahiqa', 'https://linkedin.com/in/naidrahiqa', 4),
('github', '@naidrahiqa', 'https://github.com/naidrahiqa', 5),
('telegram', '@naidrahiqa', 'https://t.me/naidrahiqa', 6),
('whatsapp', '+62 895-4126-64654', 'https://wa.me/62895412664654', 7)
on conflict (platform) do nothing;

-- ---------- PROJECTS (School: XII, XI, X per mapel; Personal) ----------
insert into public.projects (title, slug, category, class_level, subject, description, content, video_type, published) values
('Teknologi Jaringan Kabel & Nirkabel', 'tjkn-kabel-jaringan', 'school', 'xii', 'Produktif TKJ',
 'Praktik krimping kabel RJ45 UTP — modul kelas XII TKJ persiapan UKK.',
 E'### Krimping Kabel RJ45\n\nPraktik merangkai kabel UTP dengan konektor RJ45 sesuai standar T568A/T568B.\n\nPelajaran yang dapat saya ambil dari praktik kali ini adalah cara agar hasil krimping kabel RJ45 jadi bagus dan juga rapi.\n\n**Modul:** MODUL KELAS XII TKJ PRA UKK KABEL UTP SISWA.docx',
 'youtube', true),
('Konfigurasi Jaringan', 'kj-konfigurasi-jaringan', 'school', 'xii', 'Produktif TKJ',
 'Konfigurasi jaringan kelas XII — materi kejuruan Teknik Komputer dan Jaringan.',
 '', 'none', true),
('Administrasi Sistem Jaringan', 'asj-administrasi-sistem', 'school', 'xii', 'Produktif TKJ',
 'Administrasi sistem dan jaringan kelas XII TKJ.',
 '', 'none', true),
('Proyek Kelas XI', 'kelas-xi', 'school', 'xi', '',
 'Kumpulan proyek sekolah kelas XI.',
 '', 'none', true),
('Proyek Kelas X', 'kelas-x', 'school', 'x', '',
 'Kumpulan proyek sekolah kelas X.',
 '', 'none', true),
('Personal Project', 'personal-project', 'personal', '', '',
 'Proyek pribadi di luar sekolah — kernel, IoT, dan keamanan siber.',
 '', 'none', true)
on conflict (slug) do nothing;

-- ---------- ACHIEVEMENTS ----------
insert into public.achievements (title, event, category, year, description, sort_order) values
('2nd Place — LKS Kabupaten Jepara 2026', 'Lomba Kompetensi Siswa (LKS) Jepara — IT Network System Administration', 'competition', '2026', 'Juara 2 LKS tingkat kabupaten bidang IT Network System Administration.', 1),
('IONIC 2025 — Peserta', 'Cyber Security (CTF Competition)', 'competition', '2025', 'Mengikuti kompetisi CTF nasional IONIC 2025.', 2),
('Techcomfest 2026 — Peserta', 'Cyber Security (CTF Competition)', 'competition', '2026', 'Peserta kompetisi CTF Techcomfest 2026.', 3),
('Waskita Manunggal Siber 2026 — Peserta', 'Cyber Security (CTF Competition)', 'competition', '2026', 'Peserta kompetisi keamanan siber Waskita Manunggal Siber 2026.', 4),
('How To Build Your AI Assistant Tools For Pentest', 'Seminar Online', 'seminar', '2026', 'Seminar online tentang membangun tools AI assistant untuk penetration testing.', 5),
('Badan Ekraf Digital Talent (BDT) 2026 — Pelatihan', 'Pelatihan', 'training', '2026', 'Pelatihan Badan Ekraf Digital Talent 2026.', 6),
('Badan Ekraf Digital Talent (BDT) 2026 — Bootcamp', 'Bootcamp', 'training', '2026', 'Bootcamp Badan Ekraf Digital Talent 2026.', 7)
on conflict (id) do nothing;

-- ---------- BLOG POSTS ----------
insert into public.posts (title, slug, excerpt, content, video_type, published) values
('Praktik Krimping Kabel RJ45', 'praktik-krimping-rj45',
 'Cara hasil krimping kabel RJ45 jadi bagus dan rapi — dari praktik kelas XII TKJ.',
 E'## Persiapan\n\n- Kabel UTP\n- Konektor RJ45\n- Crimping tool\n- Cable tester\n\n## Langkah\n\n1. Kupas kulit kabel sepanjang ±2 cm\n2. Susun kabel sesuai urutan T568A/T568B\n3. Ratakan dan potong ujung kabel\n4. Masukkan kabel ke konektor RJ45 sampai mentok\n5. Crimping dengan kuat\n6. Tes dengan cable tester\n\n## Pelajaran\n\nPelajaran yang dapat saya ambil dari praktik kali ini adalah cara agar hasil krimping kabel RJ45 jadi bagus dan juga rapi.',
 'youtube', true),
('Mulai Membangun Portofolio Developer', 'portofolio-developer',
 'Kenapa portofolio itu penting buat developer — dan gimana cara mulai membangunnya.',
 E'## Kenapa Portofolio?\n\nPortofolio itu bukti kerja nyata, bukan sekadar klaim di CV.\n\n## Mulai Dari Mana?\n\n- Tulis apa yang kamu pelajari\n- Dokumentasikan proyek kecil\n- Jangan takut proyeknya "sepele"\n\n> Code that works beats code that''s perfect but never shipped.',
 'none', true)
on conflict (slug) do nothing;
