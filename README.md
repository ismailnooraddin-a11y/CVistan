# CV Builder — Production Starter (Next.js + Tailwind)

A fast, clean CV/resume builder:
- Live form + real-time preview
- 3 templates (Modern / Classic / Minimal)
- Autosave to browser (localStorage)
- Reorder sections
- Export:
  - **Print to PDF** (best quality, works everywhere)
  - Optional **Server PDF download** via Playwright (Docker / Node server)

## 1) Run locally
```bash
npm install
npm run dev
```
Open: http://localhost:3000

## 2) Build for production
```bash
npm run build
npm start
```

## 3) Deploy options

### Option A — Vercel (fastest)
Works perfectly for the builder + print-to-PDF export.
Server-side PDF route is usually NOT supported on many serverless hosts due to Playwright/Chromium size.

### Option B — Docker (recommended if you want 1-click PDF download)
```bash
docker build -t cv-builder .
docker run -p 3000:3000 -e ENABLE_SERVER_PDF=true cv-builder
```
Then the **Download PDF (server)** button will work.

## Env Vars
- `ENABLE_SERVER_PDF` (default false)
  - Set to `true` to enable `/api/pdf` PDF generation.

## Notes
- Data is stored locally in the browser (no login, no DB).
- You can add auth/storage later (Supabase, Firebase, etc.) without changing the templates.

## Folder structure
- `app/` Next.js App Router pages
- `components/` UI + templates
- `lib/` schema, sample data, storage utilities
- `public/` assets
