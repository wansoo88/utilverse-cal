# Project Rules — utilverse-cal

## Build & Commands
- Package manager: **npm** (not pnpm, not yarn)
- Build: `cmd /c "npm run build 2>&1"`
- Dev: `cmd /c "npm run dev"`
- Install: `cmd /c "npm install <package>"`
- Windows 환경이므로 항상 `cmd /c "..."` 래핑 필요 (PowerShell execution policy 제한)

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- UI: shadcn/ui (Radix primitives)
- Charts: Recharts
- Maps: Leaflet + react-leaflet (dynamic import, ssr: false)
- Dark mode: next-themes
- Hosting: Vercel

## Project Structure
- `app/` — Next.js App Router pages
- `components/` — Shared components (layout, analytics)
- `lib/` — Business logic, utilities
- `data/` — Static JSON data files
- `docs/` — Project documentation, specs, implementation plans
- `docs/result.md` — Phase tracking document (check before starting work)

## Conventions
- 한국어로 대화, 코드/콘텐츠는 영어
- Phase별 순차 진행 (result.md에서 현재 단계 확인)
- SSG 중심, 정적 JSON 데이터 우선
