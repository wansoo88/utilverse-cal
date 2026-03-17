# Phase 0 구현 상세 — AdSense 기반 구축

## 목표
AdSense 심사 통과를 위한 최소 요건 완성.
사이트 골격 (레이아웃, 네비게이션, 필수 페이지, 분석 도구) 세팅.

## 기간
Week 1~2

---

## Week 1: 프로젝트 초기화 + 필수 페이지

### 1. 프로젝트 세팅

```bash
pnpm create next-app@latest utilverse-cal --typescript --tailwind --eslint --app --src-dir=false
pnpm add next-themes recharts
pnpm add -D @types/node
npx shadcn-ui@latest init
```

shadcn/ui 컴포넌트 설치:
```bash
npx shadcn-ui@latest add button card select slider tabs toggle
npx shadcn-ui@latest add accordion input label separator sheet
npx shadcn-ui@latest add dropdown-menu navigation-menu tooltip
```

### 2. 글로벌 레이아웃

app/layout.tsx:
- next/font로 Inter + JetBrains Mono 로드
- next-themes ThemeProvider 래핑
- GA4 스크립트 삽입 (NEXT_PUBLIC_GA_ID)
- 메타데이터 기본값 설정

components/layout/header.tsx:
- 로고: "utilverse" 텍스트 (Inter Bold, 그라디언트)
- 네비게이션: Tools (드롭다운) | About | Contact
- 다크모드 토글 (우측)
- 모바일: 햄버거 메뉴 (Sheet 컴포넌트)

components/layout/footer.tsx:
- 3컬럼: Tools | Company | Legal
- Tools: 계산기 링크 (Phase별 추가)
- Company: About, Contact
- Legal: Privacy Policy, Terms
- 하단: © 2026 utilverse.info
- 다크모드에서도 깔끔하게

### 3. 필수 페이지 구현

/about:
```
- H1: "About utilverse"
- 사이트 미션: 무료 온라인 계산기 제공
- 운영자 소개: 1인 개발자, 데이터 기반 도구 제작
- 데이터 소스 투명성: EIA.gov, fueleconomy.gov, EPA 등 명시
- 연락처 링크
- 분량: 600자+
```

/privacy-policy:
```
- H1: "Privacy Policy"
- 수집 데이터: GA4 (페이지뷰, 세션), AdSense (광고 개인화)
- 쿠키 정책: 분석/광고 쿠키 사용 명시
- GDPR: EU 사용자 권리 (접근, 삭제, 이의)
- CCPA: California 사용자 권리
- 제3자 서비스: Google Analytics, Google AdSense, Formspree
- 연락처: 이메일
- 최종 업데이트 날짜
- 분량: 1000자+
```

/terms:
```
- H1: "Terms of Service"
- 면책조항: 계산 결과는 추정치, 실제 비용과 다를 수 있음
- 데이터 정확성: 공개 데이터 기반, 보증 없음
- 이용 제한: 상업적 재배포 금지
- 지적재산권
- 변경 고지
- 분량: 800자+
```

/contact:
```
- H1: "Contact Us"
- Formspree 이메일 폼:
  - Name (필수)
  - Email (필수)
  - Subject (선택)
  - Message (필수)
- 응답 시간 안내: "We typically respond within 48 hours."
- 대안 연락처: 이메일 주소 직접 표시
```

/not-found.tsx:
```
- 커스텀 404 페이지
- "Oops, this page doesn't exist."
- 홈으로 돌아가기 버튼
- 인기 툴 링크 3개
```

### 4. 홈페이지

app/page.tsx:
```
[Hero 섹션]
- H1: "Free Online Calculators & Tools"
- 서브텍스트: "Accurate, fast, and beautifully simple."
- 그라디언트 배경 (subtle, blue → emerald)

[Tool Grid]
- 카드 형태로 계산기 나열
- Phase 0에서는 "Coming Soon" 없이, 있는 것만 표시
- 각 카드: 아이콘 + 제목 + 한 줄 설명 + 링크

[하단 텍스트]
- 사이트 소개 200자+ (SEO용)
```

---

## Week 2: SEO 인프라 + 최적화

### 5. SEO 인프라

robots.txt (public/):
```
User-agent: *
Allow: /
Sitemap: https://utilverse.info/sitemap.xml
Disallow: /api/
```

next-sitemap 설정:
```bash
pnpm add next-sitemap
```

next-sitemap.config.js:
```javascript
module.exports = {
  siteUrl: 'https://utilverse.info',
  generateRobotsTxt: false, // 수동 관리
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
}
```

Open Graph 기본 이미지:
- public/og-default.png (1200×630px)
- 브랜드 로고 + 사이트 이름 + 그라디언트 배경

### 6. 분석 도구 연동

Google Analytics 4:
```typescript
// components/analytics/ga4.tsx
// next/script로 gtag.js 로드
// NEXT_PUBLIC_GA_ID 환경변수 사용
// 페이지뷰 자동 추적 (App Router 호환)
```

Google Search Console:
- utilverse.info 소유권 확인 (DNS TXT 또는 HTML 파일)
- Sitemap 제출
- 인덱싱 요청

Bing Webmaster Tools:
- GSC 연동으로 자동 등록
- 또는 별도 등록

### 7. 성능 최적화

Core Web Vitals 체크:
- PageSpeed Insights로 모바일/데스크톱 점수 확인
- LCP < 2.5s, CLS < 0.1, FID < 100ms 목표
- next/image 사용, 폰트 최적화, 불필요한 JS 제거

### 8. 환경변수 설정

.env.example:
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FORMSPREE_ID=xxxxxxxxxxx
NEXT_PUBLIC_OCM_API_KEY=              # Phase 1에서 사용
NEXT_PUBLIC_ADSENSE_CLIENT=           # Phase 4에서 사용
```

---

## 완료 체크리스트

```
프로젝트 세팅:
  [ ] Next.js 15 + TypeScript + Tailwind 초기화
  [ ] shadcn/ui 설치 + 테마 설정 (라이트/다크)
  [ ] 디렉토리 구조 생성
  [ ] .env.example 작성

레이아웃:
  [ ] Header (로고, 네비, 다크모드 토글, 모바일 메뉴)
  [ ] Footer (3컬럼, 링크)
  [ ] 홈페이지 (Hero + Tool Grid)

필수 페이지:
  [ ] /about (600자+)
  [ ] /privacy-policy (1000자+)
  [ ] /terms (800자+)
  [ ] /contact (Formspree 폼)
  [ ] /not-found (커스텀 404)

SEO:
  [ ] robots.txt
  [ ] next-sitemap 설정
  [ ] OG 메타태그 기본값
  [ ] Google Search Console 등록 + Sitemap 제출
  [ ] Bing Webmaster Tools 등록

분석:
  [ ] GA4 설치
  [ ] 페이지뷰 추적 확인

성능:
  [ ] Lighthouse 90+ (Performance)
  [ ] Lighthouse 95+ (Accessibility)
  [ ] Lighthouse 100 (SEO)
  [ ] 모바일 반응형 확인

배포:
  [ ] GitHub 리포지토리 연결
  [ ] Vercel 배포 설정
  [ ] utilverse.info 도메인 연결
  [ ] HTTPS 확인
```
