# 프로젝트 컨텍스트 (CLAUDE.md)

## 프로젝트 개요
- 서비스명: utilverse.info
- 목적: 글로벌 영어권 대상 초특화 니치 계산기 클러스터 (수익화 사이트)
- 타겟 사용자: EV 소유자/구매 고려자, 에어프라이어 사용자, 3D 프린팅 메이커 (미국, 유럽, 중국, 호주)

## 기술 스택
- Frontend: Next.js 15 (App Router), React 18, TypeScript (strict)
- Styling: Tailwind CSS v3 + shadcn/ui
- 차트: Recharts
- 지도: Leaflet.js + react-leaflet + OpenStreetMap
- 데이터: 정적 JSON 파일 (DB 없음)
- 호스팅: Vercel (Hobby, 무료)
- 분석: Google Analytics 4, Google Search Console
- 패키지 매니저: pnpm

## 프로젝트 구조
@docs/architecture.md

## 핵심 개발 규칙
- App Router 사용 (Pages Router 절대 사용 금지)
- Server Component 기본값 → 필요시만 'use client' 추가
- SSG 중심 렌더링 (계산기는 클라이언트 하이드레이션)
- Leaflet 등 브라우저 전용 라이브러리는 dynamic import + ssr: false
- 다크모드: next-themes + CSS 변수 기반
- 콘텐츠 톤: 캐주얼하고 친근한 영어, AI 느낌 배제
- 코드 스타일: 2칸 들여쓰기, 세미콜론 없음, 작은따옴표

## 환경변수
- .env.local: 로컬 전용 (git 제외)
- .env.example: 필요 변수 목록 (git 포함, 값은 제외)

## 참조 문서 (필요 시 @로 호출)
- 전체 아키텍처: @docs/architecture.md
- 의사결정 기록: @docs/decisions.md
- 디자인 시스템: @docs/design-system.md
- EV 계산기 스펙: @docs/ev-charging-calculator-spec.md
- SEO 전략: @docs/seo-content-strategy.md
- Phase 0 구현: @docs/implementation-phase0.md
- Phase 1 구현: @docs/implementation-phase1.md
- UI 와이어프레임: @docs/wireframes.md
- 버그 기록: @docs/bugs.md
- 실행 계획 추적: @docs/result.md
- 원본 플랜: @docs/plan.md
