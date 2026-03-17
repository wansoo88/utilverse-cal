# utilverse.info 아키텍처

## 프로젝트 개요

- 서비스명: utilverse.info
- 목적: 글로벌 영어권 대상 초특화 니치 계산기 클러스터 사이트
- 수익 모델: Google AdSense + Amazon Associates 제휴
- 운영: 1인 개발/운영, 월 $10 이내 예산

## 기술 스택

| 영역 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 15 (App Router) | SSG 지원, SEO 최적화, Vercel 네이티브 |
| 렌더링 | SSG (Static Site Generation) | 빌드 타임 정적 생성 → 빠른 로딩, 무료 호스팅 최적화 |
| 스타일링 | Tailwind CSS v3 | 유틸리티 퍼스트, 빠른 프로토타이핑, 번들 최소화 |
| UI 컴포넌트 | shadcn/ui | Tailwind 기반, 복사-붙여넣기 방식으로 번들 최소, 접근성 내장, 다크모드 지원 용이 |
| 차트 | Recharts | React 네이티브, 가벼운 번들, 반응형 차트 |
| 지도 | Leaflet.js + react-leaflet | 오픈소스, 무료, SSR 비활성화로 사용 |
| 지도 타일 | OpenStreetMap | 무료, 무제한, API 키 불필요 |
| 충전소 데이터 | Open Charge Map API | 무료, 글로벌 최대 오픈 데이터 |
| 호스팅 | Vercel (Hobby) | 무료, Edge CDN, 자동 HTTPS |
| 분석 | Google Analytics 4 | 무료, 표준 |
| 검색 | Google Search Console + Bing Webmaster Tools | 무료, 인덱싱 관리 |
| 패키지 매니저 | pnpm | 빠른 설치, 디스크 효율 |
| 언어 | TypeScript (strict) | 타입 안전성 |

### shadcn/ui 선택 이유

순수 Tailwind 대신 shadcn/ui를 쓰는 이유:
- 계산기 UI에 필요한 Select, Slider, Toggle, Tabs 등 인터랙티브 컴포넌트가 많음
- Radix UI 기반이라 키보드 네비게이션, 스크린 리더 등 접근성이 기본 내장
- 복사-붙여넣기 방식이라 node_modules 의존성 없이 커스터마이징 자유로움
- Tailwind CSS와 100% 호환, 다크모드 전환도 CSS 변수 하나로 처리
- 번들 사이즈 영향 최소 (필요한 컴포넌트만 가져옴)

## 데이터 전략

DB 서버 없이 정적 JSON 파일로 데이터를 관리한다.

```
data/
├── ev-models.json          # EV 차종 30대 스펙 (배터리 용량, EPA 효율)
├── state-rates.json        # 미국 50개 주 전기요금
├── eu-rates.json           # 유럽 주요국 전기요금
├── cn-rates.json           # 중국 지역별 전기요금
├── gas-prices.json         # 지역별 평균 가솔린 가격
├── air-fryer-presets.json  # 에어프라이어 음식 프리셋 50+개
├── filament-db.json        # 3D 프린팅 필라멘트 종류별 데이터
└── unit-conversions.json   # 단위 변환 매트릭스
```

- 빌드 타임에 JSON import → 정적 페이지 생성
- 월 1회 수동 업데이트 (Phase 4 이후 자동화 검토)
- 데이터 소스: EIA.gov, fueleconomy.gov, EPA eGRID (모두 무료 공개 데이터)

## 디렉토리 구조

```
utilverse-cal/
├── app/
│   ├── layout.tsx                          # 루트 레이아웃 (다크모드, 폰트, 메타)
│   ├── page.tsx                            # 홈 — 전체 툴 디렉토리
│   ├── about/page.tsx                      # About
│   ├── privacy-policy/page.tsx             # Privacy Policy
│   ├── terms/page.tsx                      # Terms of Service
│   ├── contact/page.tsx                    # Contact (Formspree 연동)
│   ├── not-found.tsx                       # 커스텀 404
│   │
│   ├── ev-charging-cost-calculator/        # Phase 1
│   │   └── page.tsx
│   │
│   ├── air-fryer-calculator/              # Phase 2
│   │   ├── page.tsx
│   │   └── [food-slug]/page.tsx           # 프로그래매틱 SEO 페이지
│   │
│   ├── 3d-printing-cost-calculator/       # Phase 3
│   │   └── page.tsx
│   │
│   ├── unit-converter/                    # Phase 3 프로그래매틱
│   │   └── [conversion]/page.tsx
│   │
│   └── ev-vs-gas-calculator/              # Phase 5
│       └── page.tsx
│
├── components/
│   ├── ui/                                # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── select.tsx
│   │   ├── slider.tsx
│   │   ├── tabs.tsx
│   │   ├── toggle.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx                     # 글로벌 헤더 + 네비게이션
│   │   ├── footer.tsx                     # 글로벌 푸터
│   │   ├── theme-toggle.tsx               # 다크모드 토글
│   │   └── mobile-nav.tsx                 # 모바일 네비게이션
│   ├── seo/
│   │   ├── json-ld.tsx                    # 구조화 데이터 (FAQPage, WebApplication)
│   │   └── og-image.tsx                   # OG 이미지 생성
│   ├── ev/
│   │   ├── cost-calculator.tsx            # EV 비용 계산기 메인
│   │   ├── vehicle-selector.tsx           # 차종 선택 드롭다운
│   │   ├── region-selector.tsx            # 지역 선택 (미국 주/유럽/중국)
│   │   ├── mileage-slider.tsx             # 주행거리 슬라이더
│   │   ├── charging-ratio.tsx             # 충전 비율 입력
│   │   ├── cost-result.tsx               # 비용 결과 표시
│   │   ├── cost-chart.tsx                # EV vs Gas 비교 차트
│   │   ├── savings-summary.tsx           # 절감액 + CO₂ 요약
│   │   ├── charger-finder-map.tsx        # 충전소 맵 (dynamic import)
│   │   ├── charger-marker.tsx            # 충전소 마커 + 팝업
│   │   ├── charger-list.tsx              # 충전소 리스트 뷰
│   │   ├── charger-filter.tsx            # 충전소 필터 바
│   │   └── location-input.tsx            # ZIP/위치 입력
│   ├── air-fryer/
│   │   ├── conversion-calculator.tsx
│   │   ├── preset-selector.tsx
│   │   └── cooking-chart.tsx
│   ├── printing/
│   │   ├── cost-calculator.tsx
│   │   ├── filament-selector.tsx
│   │   └── cost-breakdown-chart.tsx
│   └── shared/
│       ├── faq-section.tsx               # FAQ 아코디언 (재사용)
│       ├── guide-content.tsx             # SEO 가이드 텍스트 (재사용)
│       ├── share-buttons.tsx             # SNS 공유 버튼
│       ├── related-tools.tsx             # 관련 툴 추천
│       └── ad-slot.tsx                   # AdSense 광고 슬롯 (Phase 4)
│
├── lib/
│   ├── calculations/
│   │   ├── ev-charging.ts               # EV 충전 비용 계산 로직
│   │   ├── ev-vs-gas.ts                 # EV vs Gas TCO 비교 로직
│   │   ├── air-fryer.ts                 # 에어프라이어 변환 로직
│   │   ├── printing-cost.ts             # 3D 프린팅 비용 계산 로직
│   │   └── unit-converter.ts            # 단위 변환 로직
│   ├── utils/
│   │   ├── format.ts                    # 숫자/통화 포맷팅
│   │   ├── seo.ts                       # 메타태그/JSON-LD 헬퍼
│   │   └── geo.ts                       # Geolocation 유틸
│   ├── hooks/
│   │   ├── use-geolocation.ts           # 브라우저 위치 감지
│   │   ├── use-dark-mode.ts             # 다크모드 상태
│   │   └── use-local-storage.ts         # 로컬 스토리지 (사용자 설정 기억)
│   └── api/
│       └── open-charge-map.ts           # OCM API 클라이언트
│
├── data/                                 # 정적 JSON 데이터
│   ├── ev-models.json
│   ├── state-rates.json
│   ├── eu-rates.json
│   ├── cn-rates.json
│   ├── gas-prices.json
│   ├── air-fryer-presets.json
│   ├── filament-db.json
│   └── unit-conversions.json
│
├── public/
│   ├── favicon.ico
│   ├── og-default.png
│   ├── robots.txt
│   └── sitemap.xml                      # next-sitemap으로 자동 생성
│
├── styles/
│   └── globals.css                      # Tailwind 베이스 + CSS 변수 (다크모드)
│
├── docs/                                # 프로젝트 문서
│   ├── plan.md
│   ├── result.md
│   ├── architecture.md
│   ├── decisions.md
│   ├── design-system.md
│   ├── ev-charging-calculator-spec.md
│   ├── seo-content-strategy.md
│   ├── implementation-phase0.md
│   ├── implementation-phase1.md
│   ├── wireframes.md
│   └── bugs.md
│
├── docs_bak/                            # 이전 Blogger 프로젝트 문서 (참고용)
│
├── .env.local                           # 환경변수 (git 제외)
├── .env.example                         # 환경변수 템플릿
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── pnpm-lock.yaml
```

## 렌더링 전략

| 페이지 | 렌더링 | 이유 |
|--------|--------|------|
| 홈, About, Privacy, Terms, Contact | SSG | 정적 콘텐츠, 빌드 타임 생성 |
| EV Charging Calculator | SSG + 클라이언트 인터랙션 | 정적 셸 + 클라이언트 계산 |
| 충전소 맵 | CSR (dynamic import) | Leaflet은 window 필요, 스크롤 시 지연 로딩 |
| Air Fryer /[food-slug] | SSG (generateStaticParams) | 프로그래매틱 SEO, 빌드 타임 50~100페이지 |
| Unit Converter /[conversion] | SSG (generateStaticParams) | 프로그래매틱 SEO, 빌드 타임 30~50페이지 |

## 성능 전략

- Leaflet 맵: `next/dynamic` + `{ ssr: false }` + IntersectionObserver 지연 로딩
- 이미지: `next/image` 자동 최적화
- 폰트: `next/font` 로컬 폰트 (FOUT 방지)
- 번들: 계산기별 코드 스플리팅 (각 페이지 독립 번들)
- 목표: Lighthouse 90+ (Performance, Accessibility, SEO, Best Practices)

## 환경변수

```
# .env.example
NEXT_PUBLIC_GA_ID=              # Google Analytics 4 측정 ID
NEXT_PUBLIC_OCM_API_KEY=        # Open Charge Map API 키 (무료)
NEXT_PUBLIC_FORMSPREE_ID=       # Formspree 폼 ID (Contact 페이지)
NEXT_PUBLIC_ADSENSE_CLIENT=     # AdSense 클라이언트 ID (Phase 4)
```

## 배포 파이프라인

```
로컬 개발 (pnpm dev)
  → GitHub push
  → Vercel 자동 빌드 (SSG)
  → Vercel Edge CDN 배포
  → 자동 HTTPS (utilverse.info)
```

## 확장 방향

- Phase 4+: AdSense 광고 슬롯 활성화
- Phase 5+: 계산기 Suite화 (EV 관련 3~4개 묶음)
- Phase 7+: Ezoic 전환 검토, 뉴스레터, 임베드 위젯
