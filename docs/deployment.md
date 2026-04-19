# Vercel 배포 가이드

프로덕션 도메인: **`https://cal.utilverse.info`** (서브도메인)

---

## 1. 배포 전 체크리스트

| 항목 | 상태 | 확인 방법 |
|---|---|---|
| `next-sitemap.config.js`의 siteUrl | ✅ `cal.utilverse.info` | 이미 설정 |
| `public/robots.txt`의 Sitemap URL | ✅ `cal.utilverse.info` | 이미 설정 |
| 각 페이지 JSON-LD url 필드 | ✅ `cal.utilverse.info` | 이미 설정 |
| `metadataBase` | ✅ env fallback | `app/layout.tsx` |
| `public/og-default.png` | ⚠️ **PNG 변환 필요** | 아래 참고 |
| `.env.local` 프로덕션에는 불필요 | — | Vercel 대시보드에 등록 |

---

## 2. OG 이미지 PNG 변환

`public/og-default.svg`가 생성되어 있습니다. 소셜 미디어는 PNG/JPG만 미리보기를 생성하므로 1200×630 PNG로 변환해야 합니다.

### 옵션 A — 온라인 변환 (빠름)
1. https://cloudconvert.com/svg-to-png 에 `public/og-default.svg` 업로드
2. Width 1200, Height 630 지정 → 변환 → 다운로드
3. `public/og-default.png`로 저장 후 커밋

### 옵션 B — ImageMagick (CLI)
```bash
magick -background none -size 1200x630 public/og-default.svg public/og-default.png
```

### 옵션 C — sharp (Node)
```bash
npx --package=sharp-cli sharp -i public/og-default.svg -o public/og-default.png resize 1200 630
```

### 검증
- 파일 크기 < 1MB
- 1200×630px 정확히
- Twitter Card Validator: https://cards-dev.twitter.com/validator
- Facebook Debugger: https://developers.facebook.com/tools/debug/

---

## 3. Vercel 프로젝트 생성

### 3-1. 최초 배포 (GitHub 연동)
1. https://vercel.com/new 접속
2. GitHub repo `wansoo88/utilverse-cal` import
3. Framework Preset: **Next.js** (자동 감지)
4. Build Command: `pnpm build` (vercel.json에 이미 있음)
5. Install Command: `pnpm install` (이미 있음)
6. Output Directory: `.next` (이미 있음)

### 3-2. CLI 배포 (선택)
```bash
npm i -g vercel
vercel login
vercel link        # 기존 프로젝트와 연결
vercel --prod      # 프로덕션 배포
```

---

## 4. 환경변수 등록 (Vercel Dashboard)

Settings → Environment Variables 에서 등록.
Environment는 **Production + Preview + Development 모두 체크**.

| Key | Value | 필수 여부 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://cal.utilverse.info` | ✅ 필수 |
| `NEXT_PUBLIC_OCM_API_KEY` | `f78413b8-8400-47bb-98e9-992d1136e229` | ✅ 필수 (EV 충전소 맵) |
| `NEXT_PUBLIC_GA_ID` | (GA4 측정 ID) | 선택 (분석용) |
| `NEXT_PUBLIC_FORMSPREE_ID` | (Formspree ID) | 선택 (Contact 폼용) |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | (AdSense 승인 후) | 선택 (Phase 4) |

> ⚠️ `NEXT_PUBLIC_*` 프리픽스는 클라이언트 번들에 포함됩니다. API 키가 노출되는 특성을 감안하고 쓰세요. OCM은 공개 키라 무방.

---

## 5. 도메인 연결

### 5-1. Vercel Dashboard → Settings → Domains
1. `cal.utilverse.info` 추가
2. Vercel이 DNS 설정 방법을 안내

### 5-2. DNS 제공자 (utilverse.info 관리 사이트)에서 CNAME 추가
```
Type:  CNAME
Name:  cal
Value: cname.vercel-dns.com
TTL:   Auto
```

### 5-3. 전파 대기
- 보통 1~10분. `dig cal.utilverse.info` 로 CNAME 반영 확인
- Vercel 대시보드에서 "Valid Configuration" 녹색 체크 표시됨

---

## 6. 배포 후 필수 작업

### 6-1. Google Search Console 등록

utilverse.info 루트 도메인에 다른 프로젝트가 추가될 예정이므로
**도메인 속성**과 **URL 접두어 속성 두 개 모두 등록**을 권장합니다.

#### (a) 도메인 속성 — 서브도메인 통합 모니터링 (우선 권장)
1. https://search.google.com/search-console 접속 → 속성 추가 → **도메인** 선택
2. `utilverse.info` 입력 (서브도메인·https/http 전부 한 번에 커버)
3. 표시된 TXT 레코드 복사 (예: `google-site-verification=abc...`)
4. **카페24 DNS 관리** → 레코드 추가:
   - 호스트: `@` (또는 비워둠)
   - 타입: `TXT`
   - 값: 복사한 전체 문자열
   - TTL: 3600
5. 저장 후 5~30분 기다림 → GSC "확인" 버튼 클릭

> 도메인 속성 하나로 현재/미래 모든 서브도메인(`cal.`, `blog.`, `app.` …)을 통합 모니터링할 수 있습니다.

#### (b) URL 접두어 속성 — 서브도메인별 세부 지표
1. 속성 추가 → **URL 접두어** → `https://cal.utilverse.info` 입력
2. 소유권 확인: 도메인 속성을 이미 등록했다면 자동 인증
3. **Sitemaps** 메뉴 → 입력창에 `sitemap.xml`만 입력 후 제출
4. URL 검사 도구로 주요 페이지 6개 인덱싱 요청:
   - `/`
   - `/ev-charging-cost-calculator`
   - `/ev-vs-gas-calculator`
   - `/air-fryer-calculator`
   - `/3d-printing-cost-calculator`
   - `/unit-converter`

### 6-2. Bing Webmaster Tools (선택)
- https://www.bing.com/webmasters
- GSC 연동으로 자동 등록 가능 → 소유권 즉시 확인
- Sitemap 동일하게 제출

### 6-3. OG/Twitter Card 미리보기 검증
- Twitter: https://cards-dev.twitter.com/validator
- Facebook: https://developers.facebook.com/tools/debug/
- LinkedIn: https://www.linkedin.com/post-inspector/

---

## 7. 모니터링

| 도구 | 목적 | 빈도 |
|---|---|---|
| Vercel Analytics | 배포 상태, 트래픽 | 수시 |
| GA4 | 사용자 행동 | 일일 |
| GSC | 인덱싱, 검색 쿼리 | 주간 |
| Lighthouse (PageSpeed) | Core Web Vitals | 배포마다 |

---

## 8. 롤백

문제 발생 시 Vercel Dashboard → Deployments → 이전 성공 배포의 `⋯` 메뉴 → **Promote to Production**. 즉시 전환되며 DNS는 유지됨.

---

## 9. SEO 전략 요약

- **sitemap**: 단일 `/sitemap.xml`, 118개 URL 직접 나열 (index 구조 제거)
  - `<loc>`만 포함. `priority`/`changefreq`는 Google이 무시, `lastmod`는 빌드시점이 전체 동일해 무의미하므로 생략 (공식 권고)
- **OG 이미지**: `app/opengraph-image.tsx`가 `/opengraph-image` 엔드포인트에서 1200×630 PNG를 edge runtime으로 동적 생성. `app/twitter-image.tsx`는 동일 이미지 재사용
- **구조화 데이터**:
  - 루트: Organization + WebSite
  - 계산기 페이지: BreadcrumbList + WebApplication + FAQPage
  - air-fryer 프로그래매틱 slug: BreadcrumbList + HowTo + FAQPage
  - unit-converter 프로그래매틱 slug: BreadcrumbList + WebApplication + FAQPage
- **서브도메인 전략**: 루트 `utilverse.info`는 향후 다른 프로젝트용 예약, 계산기는 `cal.` 서브도메인에 격리 (GSC 도메인 속성으로 통합 모니터링)
