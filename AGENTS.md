<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Naidrahiqa — Project Agent Guide

## Overview

Personal portfolio + school project showcase for Faqih Ardian Syah. Built with Next.js 16 + TypeScript + Tailwind v4 + Supabase (free tier). Deployed on Vercel.

- **Public name**: FAQIH ARDIAN SYAH (full name in hero), "Naidrahiqa" is the nickname/brand
- **Contact email**: faqihardiansyah89@gmail.com
- **Admin email**: naidrahiqa@naidra.dev (RLS-protected)

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.3.0 (`src/` dir, typed routes via `PageProps<>`) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email magic link, rate-limited) |
| Storage | Supabase Storage (`media` bucket, public) |
| UI | lucide-react icons, custom admin components |
| Content | react-markdown + remark-gfm (markdown rendering) |
| PDF | pdfjs-dist (certificate preview) |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://kcensjxxnvoyacepzbqs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_glGSfw_DWk1W2LGVKiGvnA_qOxTzvWT
ADMIN_EMAIL=naidrahiqa@naidra.dev
```

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages (no layout wrapper)
│   │   ├── page.tsx        # Homepage (hero, featured projects, achievements)
│   │   ├── about/page.tsx  # About page (dynamic sections from DB)
│   │   ├── contact/page.tsx # Contact page
│   │   └── projects/       # Project showcase
│   │       ├── page.tsx             # All projects (school tabs + personal grid)
│   │       ├── [slug]/page.tsx      # Project detail (blog-style layout)
│   │       └── school/[class]/      # Class pages
│   │           ├── page.tsx         # Subject cards for that class
│   │           └── [subject]/page.tsx # Projects filtered by subject
│   ├── admin/
│   │   ├── login/page.tsx  # Magic link login
│   │   └── (panel)/        # Admin layout (sidebar + toast provider)
│   │       ├── layout.tsx           # AdminSidebar + LogoutButton + ToastProvider
│   │       ├── page.tsx             # Dashboard (stats)
│   │       ├── projects/            # Project CRUD
│   │       ├── achievements/        # Achievement CRUD
│   │       ├── about/page.tsx       # About sections editor
│   │       ├── contacts/page.tsx    # Contacts editor
│   │       └── profile/page.tsx     # Profile editor
│   └── api/admin/          # Admin API routes (RLS-protected)
├── components/
│   ├── admin/              # Admin UI components
│   │   ├── ui.tsx          # Button, Card, Input, Label, Select, TextArea, StatusPill
│   │   ├── AdminSidebar.tsx # Client sidebar with active route highlighting
│   │   ├── Toast.tsx       # Toast notification system (context provider)
│   │   ├── ProjectForm.tsx # Sectioned form (Basic Info / Content / Media / Display)
│   │   ├── MediaGallery.tsx # Media items with preview, reorder, type hints
│   │   ├── FileUpload.tsx  # Upload or paste URL (Drive/Supabase)
│   │   ├── VideoFields.tsx # Hero video URL + type selector
│   │   ├── LayoutPreview.tsx # Wireframe previews for layout options
│   │   ├── FeaturedToggle.tsx # Star toggle for featured projects
│   │   ├── DeleteButton.tsx # Delete with confirmation (shows item name)
│   │   └── LogoutButton.tsx
│   ├── ProjectLayout.tsx   # Layout renderer (5 layout variants)
│   ├── ProjectGallery.tsx  # Gallery with lightbox, video embed, LinkCards
│   ├── ImageLightbox.tsx   # Full-size image modal
│   ├── BrandIcon.tsx       # Social media icons
│   └── ScrollReveal.tsx    # Scroll animation wrapper
├── lib/
│   ├── types.ts            # All TypeScript interfaces
│   ├── utils.ts            # cn(), slugify(), resolveImageUrl(), detectVideoType()
│   ├── admin.ts            # requireAdmin() — fail-closed RLS check
│   ├── admin-fields.ts     # Field whitelists for PUT validation
│   ├── api.ts              # dbError() helper
│   └── supabase/
│       ├── client.ts       # Browser Supabase client
│       └── server.ts       # Server Supabase client
└── supabase/
    └── migrations/         # 001-009 (run in order in Supabase SQL Editor)
```

## Key Patterns

### Authentication & Security
- Admin access: `requireAdmin()` in `src/lib/admin.ts` — checks `ADMIN_EMAIL` env var (fail-closed)
- RLS policies: all writes require auth + matching email
- API routes validate fields against whitelists in `admin-fields.ts`
- Storage cleanup runs on project/achievement delete
- Slug uniqueness enforced on create/update (409 conflict)

### Image/Video Handling
- `resolveImageUrl()` in `src/lib/utils.ts` handles:
  - Bare filenames from FileUpload → Supabase Storage URL
  - `media/...` paths → Supabase Storage URL
  - Google Drive URLs → `lh3.googleusercontent.com/d/FILE_ID=s0`
  - Regular HTTP URLs → pass-through
- `detectVideoType()` auto-detects YouTube/Drive/storage from URL
- FileUpload component: upload to Supabase Storage or paste URL (auto-converts Drive links)

### Project Layouts (5 variants)
- `video-focus` — main video center, content + gallery below
- `gallery-first` — image grid top, text below
- `text-first` — content leads, media supports
- `cover-hero` — full-width cover with overlay text
- `masonry` — Pinterest-style image grid

### Admin Form UX
- ProjectForm uses collapsible sections (Basic Info / Content / Media / Display Settings)
- Unsaved changes warning via `beforeunload` + cancel confirmation
- Media loading indicator prevents save-before-load
- Toast notifications for success/error feedback
- Breadcrumb navigation on edit pages
- Delete confirmations show item name

### Class/Subject Hierarchy
```
/projects → class cards (X, XI, XII)
  → /projects/school/xii → subject cards (Produktif TKJ, etc.)
    → /projects/school/xii/produktif-tkj → individual project cards
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build (verify after changes)
npm run lint     # ESLint
```

## Migrations

Run in order in Supabase SQL Editor. Never modify a migration after it's been applied — create a new one.

| # | Purpose |
|---|---------|
| 001-006 | Core tables (profile, about, contacts, projects, achievements, posts) |
| 007 | Featured column for projects |
| 008 | Layout column for projects |
| 009 | `replace_project_media` RPC (SECURITY INVOKER, atomic media update) |

## Conventions

- **File naming**: kebab-case for files, PascalCase for components
- **Admin components**: go in `src/components/admin/`
- **Public components**: go in `src/components/`
- **API routes**: under `src/app/api/admin/` with field validation
- **No comments** in code unless explicitly requested
- **Tailwind classes**: use `cn()` utility for conditional classes
- **Types**: all in `src/lib/types.ts`, exported as interfaces
- **Errors**: use `dbError()` from `src/lib/api.ts` for API errors, `toast()` for UI errors
