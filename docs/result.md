# utilverse.info 실행 계획 추적

> 이 문서는 Phase별 실행 계획과 진행 상태를 추적합니다.
> 각 Phase 시작 전 반드시 확인 후 진행합니다.

---

## 현재 단계: Phase 1 진행 중 (Week 3 완료 → Week 4 대기)

### 완료 항목
- [x] plan.md 분석 완료
- [x] docs_bak 구조 분석 완료
- [x] 인터뷰 완료 (2026-03-16)
- [x] docs/ 문서 세트 생성 (9개 파일)
- [x] 문서 검토 및 승인

### 인터뷰 결과 요약

| 항목 | 결정 |
|------|------|
| 프로젝트 상태 | 처음부터 새로 시작 |
| 기술 스택 | Next.js App Router + Vercel + Tailwind CSS (plan.md 기준) |
| DB | 필요 시 판단하여 사용 (SSG 중심, 정적 JSON 우선) |
| UI 라이브러리 | 프로젝트 취지/난이도 고려하여 결정 |
| 디자인 | 깔끔한 미니멀 + fancy, 다크모드 지원 |
| 브랜드/컬러 | 자율 결정 (fancy하게) |
| 콘텐츠 톤 | 캐주얼하고 친근한 톤, 미국 영어 기준 |
| 타겟 지역 | 미국, 영국, 캐나다, 호주 + 유럽(독일/노르웨이/네덜란드), 중국 |
| 실행 범위 | docs/ 문서 생성만 (승인 전까지 코드 실행 없음) |
| 진행 방식 | Phase 단계별 하나씩, 이 문서에서 추적 |

### 생성할 문서 목록

| 파일명 | 역할 | docs_bak 참고 |
|--------|------|---------------|
| `architecture.md` | 프로젝트 아키텍처, 디렉토리 구조, 기술 스택 상세 | architecture.md |
| `decisions.md` | 기술 의사결정 기록 (ADR) | decisions.md |
| `design-system.md` | 브랜드 아이덴티티, 컬러, 타이포, 컴포넌트 디자인 가이드 | (신규) |
| `ev-charging-calculator-spec.md` | EV 충전 비용 계산기 기능 스펙 | blogger_webapp_spec.md |
| `seo-content-strategy.md` | SEO 전략, 콘텐츠 톤, 다국어/다지역 전략 | content_calendar.md + implementation-seo.md |
| `implementation-phase0.md` | Phase 0 구현 상세 (필수 페이지, GSC, GA4) | implementation-*.md |
| `implementation-phase1.md` | Phase 1 구현 상세 (EV Calculator) | implementation-*.md |
| `wireframes.md` | 주요 페이지 UI 와이어프레임 | dashboard_wireframes.md |
| `bugs.md` | 버그 기록 템플릿 | bugs.md |

### 파일 구조 현황

```
utilverse-cal/
├── app/
│   ├── layout.tsx                          ✅ Phase 0
│   ├── page.tsx                            ✅ Phase 0
│   ├── globals.css                         ✅ Phase 0
│   ├── not-found.tsx                       ✅ Phase 0
│   ├── favicon.ico                         ✅
│   ├── about/page.tsx                      ✅ Phase 0
│   ├── contact/
│   │   ├── page.tsx                        ✅ Phase 0
│   │   └── contact-form.tsx                ✅ Phase 0
│   ├── privacy-policy/page.tsx             ✅ Phase 0
│   ├── terms/page.tsx                      ✅ Phase 0
│   └── ev-charging-cost-calculator/        ✅ Phase 1 (Week 3)
│       ├── page.tsx                        ✅ SSG + JSON-LD + FAQ + 가이드
│       ├── ev-calculator.tsx               ✅ 9개 지역, 38대 차종, 충전비율
│       └── cost-chart.tsx                  ✅ Recharts EV vs Gas 바 차트
├── components/
│   ├── analytics/ga4.tsx                   ✅ Phase 0
│   └── layout/
│       ├── header.tsx                      ✅ Phase 0
│       ├── footer.tsx                      ✅ Phase 0
│       ├── theme-provider.tsx              ✅ Phase 0
│       └── theme-toggle.tsx                ✅ Phase 0
├── data/
│   ├── ev-models.json                      ✅ Phase 1 (38대)
│   ├── electricity-rates.json              ✅ Phase 1 (9개 지역)
│   └── gas-prices.json                     ✅ Phase 1 (9개 지역)
├── lib/
│   ├── utils.ts                            ✅
│   └── ev/
│       ├── types.ts                        ✅ Phase 1
│       └── calculations.ts                 ✅ Phase 1
├── public/
│   └── robots.txt                          ✅ Phase 0
├── .env.example                            ✅ Phase 0
├── next-sitemap.config.js                  ✅ Phase 0
├── package.json                            ✅ (recharts, next-themes, shadcn/ui 등)
└── docs/ (9개 문서)                         ✅
```

### 상태
- ✅ Phase 0 완료
- 🔧 Phase 1 Week 3 완료 (계산기 UI + 데이터 + 차트)
- ⏳ Phase 1 Week 4 대기 (충전소 맵 + 배포 최적화)

---

## Phase 0: AdSense 기반 구축

> 상태: ✅ 완료 (2026-03-16)

### 완료 항목
- [x] Next.js 15 (16.1.6) + TypeScript + Tailwind v4 초기화
- [x] shadcn/ui 컴포넌트 설치 (Radix UI 기반)
- [x] next-themes 다크모드 설정 (components/layout/theme-provider.tsx)
- [x] globals.css — Electric Blue/Emerald 디자인 시스템 (CSS 변수 기반)
- [x] app/layout.tsx — Inter 폰트, ThemeProvider, GA4, Header/Footer 레이아웃
- [x] components/layout/header.tsx — 로고(gradient-text), Tools 드롭다운(3개 툴), About/Contact 네비, 다크모드 토글, 모바일 햄버거 메뉴
- [x] components/layout/footer.tsx — 4컬럼 (브랜드 + Tools + Company + Legal), 데이터 소스 크레딧
- [x] components/layout/theme-toggle.tsx — Sun/Moon 아이콘 토글
- [x] components/analytics/ga4.tsx — GA4 스크립트 (NEXT_PUBLIC_GA_ID, afterInteractive)
- [x] app/page.tsx — Hero (그라디언트 배경, "Free forever" 배지) + Tool Grid (3개 카드, hover 애니메이션) + Trust section (EIA/EPA/fueleconomy.gov 링크)
- [x] app/about/page.tsx — 사이트 미션, 데이터 소스 투명성, 운영자 소개, 연락처 (600자+)
- [x] app/privacy-policy/page.tsx — GA4/AdSense/Formspree 데이터 수집 명시, 쿠키 정책, GDPR + CCPA 포함 (1000자+)
- [x] app/terms/page.tsx — 면책조항, 이용 제한, 지적재산권, 책임 제한 (800자+)
- [x] app/contact/page.tsx + contact-form.tsx — Formspree 연동 폼 (Name/Email/Subject/Message), 전송 상태 관리
- [x] app/not-found.tsx — 커스텀 404 (gradient 404 텍스트, 3개 툴 링크, 홈 링크)
- [x] public/robots.txt — Allow: /, Disallow: /api/, Sitemap 링크
- [x] next-sitemap.config.js (postbuild 자동 생성)
- [x] .env.example — GA_ID, FORMSPREE_ID, OCM_API_KEY, ADSENSE_CLIENT

---

## Phase 1: EV Charging Cost Calculator

> 상태: 🔧 진행 중 — Week 3 + Week 4 맵 구현 완료, 테스트/배포 대기

### 완료 항목
- [x] data/ev-models.json — 38대 EV 모델 스펙 (Tesla, Hyundai, Kia, BMW, Mercedes, VW, Audi, Porsche, Ford, Chevy, Rivian, Polestar, Volvo, Nissan, BYD, NIO, XPeng, Li Auto)
- [x] data/electricity-rates.json — 미국 50개 주 + UK/DE/NO/NL/FR + 중국 4개 도시 + 호주 8개 주 + 캐나다 8개 프로빈스
- [x] data/gas-prices.json — 지역별 가솔린 가격 (미국 주별, 유럽/중국/호주/캐나다)
- [x] lib/ev/types.ts — EVModel, RegionCode, ChargingRatio, CalculationInput/Result, ChargerStation, ChargerFilter 타입
- [x] lib/ev/calculations.ts — 월간/연간/5년 충전 비용, EV vs Gas 비교, CO₂ 절감량, 다지역 단위 변환
- [x] app/ev-charging-cost-calculator/page.tsx — SSG 페이지, JSON-LD (WebApplication + FAQPage), 메타데이터, 가이드 텍스트 800자+, FAQ 7개
- [x] app/ev-charging-cost-calculator/ev-calculator.tsx — 9개 지역 선택, 차종 검색/선택, 주행거리 슬라이더, 충전 비율 프리셋 4개 + 커스텀 슬라이더, 결과 카드, 비용 분석 바
- [x] app/ev-charging-cost-calculator/cost-chart.tsx — Recharts BarChart (EV vs Gas 월간/연간/5년 비교)
- [x] leaflet + react-leaflet + @types/leaflet 설치
- [x] lib/ev/open-charge-map.ts — Open Charge Map API 연동 (fetchNearbyChargers, 파싱, 필터)
- [x] app/ev-charging-cost-calculator/charger-map.tsx — ChargerFinderMap (위치 검색, ZIP/Geolocation, 필터 4종, 반경 선택, 충전소 리스트)
- [x] app/ev-charging-cost-calculator/leaflet-map.tsx — Leaflet 맵 (dynamic import ssr:false, 다크모드 CartoDB 타일, 컬러 마커, 팝업+Get Directions)
- [x] IntersectionObserver 지연 로딩 (맵 섹션 스크롤 도달 시 로드)
- [x] 빌드 성공 확인 (npm run build)

### 남은 항목
- [ ] dev 서버에서 맵 기능 실제 동작 테스트
- [ ] .env에 NEXT_PUBLIC_OCM_API_KEY 설정 후 API 호출 확인
- [ ] 모바일 반응형 최종 테스트
- [ ] Lighthouse 성능 체크 (90+ 목표)
- [ ] OG 이미지 생성
- [ ] GSC 인덱싱 요청

---

## Phase 2: Air Fryer Conversion Calculator

> 상태: ✅ 완료

### 완료 항목
- [x] lib/airfryer/types.ts — CookingMethod, ConversionResult, FoodPreset 타입
- [x] lib/airfryer/conversions.ts — 5-way 변환 로직 (Oven↔Air Fryer↔Convection↔Instant Pot↔Slow Cooker), °F/°C 변환
- [x] data/food-presets.json — 20개 인기 음식 프리셋 (Poultry, Meat, Seafood, Vegetables, Sides, Frozen)
- [x] app/air-fryer-calculator/page.tsx — SSG 페이지, JSON-LD (WebApplication + FAQPage), 가이드 텍스트 800자+, FAQ 5개
- [x] app/air-fryer-calculator/airfryer-calculator.tsx — 프리셋 선택 (카테고리 필터), 5-way 변환 UI, °F/°C 토글, 방향 스왑, 결과+팁, 비교 테이블
- [x] 빌드 성공 확인

---

## Phase 3: 3D Printing Cost Calculator + 프로그래매틱 확장

> 상태: 🔄 진행 중 — 3D Printing Calculator 완료, 프로그래매틱 확장 대기

### 완료 항목
- [x] lib/printing/types.ts — FilamentType, PrintCostInput, PrintCostResult 타입
- [x] lib/printing/calculations.ts — 재료비, 전기비, 감가상각, 실패 마진, 판매가 계산
- [x] data/filaments.json — 12종 필라멘트 (PLA, ABS, PETG, TPU, Nylon, ASA, PLA+, Resin 2종, CF PLA, Wood PLA, Custom)
- [x] app/3d-printing-cost-calculator/page.tsx — SSG 페이지, JSON-LD, 가이드 텍스트 800자+, FAQ 5개
- [x] app/3d-printing-cost-calculator/printing-calculator.tsx — 필라멘트 선택, 무게/시간/프린터가격/전기요금/와트/실패율 입력, 결과 카드, 판매가 제안
- [x] app/3d-printing-cost-calculator/cost-pie-chart.tsx — Recharts PieChart 비용 분석
- [x] 빌드 성공 확인

---

## Phase 4: AdSense 재신청 + 수익화

> 상태: 대기

---

## Phase 5: EV vs Gas Calculator + 백링크

> 상태: 대기

---

## Phase 6: 성과 측정 + 피벗/가속

> 상태: 대기
