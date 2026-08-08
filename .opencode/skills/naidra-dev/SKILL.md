---
name: naidra-dev
description: Development guide for the Naidrahiqa portfolio project (Next.js 16 + Supabase). Use when working on this codebase — covers architecture, conventions, common tasks, and gotchas.
---

# Naidrahiqa Development Skill

## Architecture

Personal portfolio + school project showcase. Next.js 16 (`src/` dir) + TypeScript + Tailwind v4 + Supabase free tier.

- **Public name**: FAQIH ARDIAN SYAH (hero), "Naidrahiqa" is the brand/nickname
- **Admin email**: naidrahiqa@naidra.dev (RLS-protected)
- **Contact**: faqihardiansyah89@gmail.com

## Common Tasks

### Adding a new admin page
1. Create page at `src/app/admin/(panel)/your-page/page.tsx`
2. Add nav entry in `src/components/admin/AdminSidebar.tsx`
3. Create API route at `src/app/api/admin/your-page/route.ts`
4. Use `requireAdmin()` from `src/lib/admin.ts` for auth
5. Use `dbError()` from `src/lib/api.ts` for error responses
6. Use `toast()` from `src/components/admin/Toast.tsx` for UI feedback

### Adding a new public page
1. Create page at `src/app/(public)/your-page/page.tsx`
2. Use existing components from `src/components/`
3. Fetch data server-side with `createClient()` from `src/lib/supabase/server.ts`

### Modifying the project form
- `ProjectForm.tsx` uses collapsible `<Section>` components
- Media is managed via `MediaGallery` + `FileUpload`
- Hero video is separate from media gallery
- Unsaved changes tracked via `isDirty` ref + `beforeunload` event

### Image/Video URLs
- `resolveImageUrl()` handles: bare filenames, `media/...` paths, Google Drive, HTTP URLs
- `detectVideoType()` auto-detects: YouTube, Google Drive, Supabase Storage
- FileUpload converts Google Drive links to `lh3.googleusercontent.com/d/FILE_ID=s0`
- Always use `resolveImageUrl()` when rendering images from DB

### Database changes
1. Create migration in `supabase/migrations/` (numbered sequentially)
2. Never modify applied migrations — create new ones
3. Run in Supabase SQL Editor in order
4. Current latest: 009 (`replace_project_media` RPC)

## Gotchas

- **Bare filenames**: FileUpload stores `1723456789-image.jpg` (no `media/` prefix). `resolveImageUrl()` handles this.
- **Media wipe on save**: ProjectForm blocks save if media fetch failed on edit. Don't remove `mediaLoaded` check.
- **Slug uniqueness**: API returns 409 on duplicate slug. Always use the `slugify()` helper.
- **Storage cleanup**: DELETE routes clean up Supabase Storage files. Don't remove this when modifying delete handlers.
- **Layout wireframes**: `LayoutPreview.tsx` shows visual previews for each layout option.
- **Video false-positives**: `detectVideoType()` only matches actual YouTube/Drive URLs, not arbitrary strings.
- **Admin sidebar**: Uses `usePathname()` for active route highlighting. Don't convert back to server component.

## File Map

| Task | Files |
|------|-------|
| Admin CRUD | `src/app/admin/(panel)/[entity]/`, `src/app/api/admin/[entity]/` |
| Project form | `src/components/admin/ProjectForm.tsx`, `MediaGallery.tsx`, `FileUpload.tsx`, `VideoFields.tsx` |
| Public project detail | `src/app/projects/[slug]/page.tsx`, `ProjectLayout.tsx`, `ProjectGallery.tsx` |
| Class/subject pages | `src/app/projects/school/[class]/`, `src/app/projects/school/[class]/[subject]/` |
| Image handling | `src/lib/utils.ts` (`resolveImageUrl`, `detectVideoType`) |
| Auth | `src/lib/admin.ts` (`requireAdmin()`) |
| Toast feedback | `src/components/admin/Toast.tsx` (`useToast()`) |
| Types | `src/lib/types.ts` |
