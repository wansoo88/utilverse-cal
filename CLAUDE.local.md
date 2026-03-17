# 개인 설정 (CLAUDE.local.md)
# ⚠️ .gitignore에 자동 추가됨 — 팀과 절대 공유되지 않음

## 개발 환경
- OS: Windows 11
- 패키지 매니저: pnpm
- Node 버전: v20.x
- 에디터: VS Code + Claude Code Extension
- 터미널: PowerShell

## 로컬 서비스 포트
- Next.js 개발 서버: http://localhost:3000
- PostgreSQL: localhost:5432
- Prisma Studio: http://localhost:5555

## 개인 선호 설정
- 응답 언어: 한국어
- 코드 들여쓰기: 2칸 (spaces)
- 세미콜론: 없음 (no semicolons)
- 따옴표: 작은따옴표 (single quotes)

## 로컬 전용 npm 스크립트
- 앱 실행: `pnpm dev`
- 빌드: `pnpm build`
- DB 마이그레이션: `pnpm db:migrate`
- Prisma 타입 생성: `pnpm db:generate`
- Prisma Studio 열기: `pnpm db:studio`
- 테스트: `pnpm test`
- 린트: `pnpm lint`

## 개인 메모
<!--처음실행시 필요한 프롬프트>
plan.md를 읽고 구체적인 실행계획을 작성하세요. docs_bak 폴더 하위에 있는 md 파일 구조를 읽고 필요한 md파일을 생성해내세요. 지금 이 단계가 제일 중요합니다. 면밀히 검토하세요. 특히 ai가 만든것 처럼 느끼지 않게 기능 및 blog, 디자인 모두 꼼꼼히 고려하세요. 실행전 나에게 충분히 인터뷰해주세요
