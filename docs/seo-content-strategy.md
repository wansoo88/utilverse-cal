# SEO & 콘텐츠 전략

## 콘텐츠 톤 가이드

### 목표 톤
친구가 카페에서 "야 나 전기차 충전비 얼마나 나올까?" 물어봤을 때 대답하는 느낌.
전문적이되 딱딱하지 않고, 캐주얼하되 신뢰를 잃지 않는 선.

### 톤 규칙

쓰는 표현:
- "Here's the deal:" / "The short answer:" / "Let's break it down."
- "Most people" / "In our experience" / "Based on the data"
- 구체적 숫자와 비교 ("That's about $47/month — roughly the cost of two pizza deliveries.")
- 짧은 문장과 긴 문장 섞기
- 2인칭 ("you", "your") 적극 사용

피하는 표현:
- "In this comprehensive guide" / "Without further ado" / "In today's fast-paced world"
- "game-changer" / "unlock" / "dive into" / "harness" / "leverage" / "revolutionize"
- "cutting-edge" / "state-of-the-art" / "best-ever"
- 이모지 사용 금지 (텍스트 콘텐츠 내)
- "So," / "Well," / "Now,"로 문단 시작 금지

### 예시

나쁜 예:
> "In today's rapidly evolving electric vehicle landscape, understanding the intricacies of charging costs has become a game-changer for savvy consumers looking to harness the power of sustainable transportation."

좋은 예:
> "Switching to an EV sounds great until you wonder: how much is this actually going to cost me to charge? The answer depends on three things — where you live, how you charge, and how much you drive. Let's figure out your number."

---

## SEO 기술 전략

### 메타태그 구조

```typescript
// 각 계산기 페이지 메타데이터
export const metadata: Metadata = {
  title: 'EV Charging Cost Calculator — How Much to Charge Your EV | utilverse',
  description: 'Calculate your monthly EV charging cost by vehicle, location, and charging habits. Compare EV vs gas costs and find charging stations near you.',
  keywords: ['ev charging cost', 'electric car charging calculator', 'ev vs gas cost'],
  openGraph: {
    title: 'EV Charging Cost Calculator',
    description: 'Find out exactly how much it costs to charge your electric car.',
    type: 'website',
    url: 'https://utilverse.info/ev-charging-cost-calculator',
    images: ['/og/ev-charging-calculator.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EV Charging Cost Calculator',
    description: 'Find out exactly how much it costs to charge your electric car.',
  },
  alternates: {
    canonical: 'https://utilverse.info/ev-charging-cost-calculator',
  },
}
```

### 구조화 데이터 (JSON-LD)

각 계산기 페이지에 2개 스키마 삽입:

1. WebApplication 스키마 — 계산기 도구 자체
2. FAQPage 스키마 — FAQ 섹션

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does it cost to charge a Tesla at home?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Charging a Tesla Model 3 at home costs roughly $30-50 per month..."
      }
    }
  ]
}
```

### Sitemap 전략

```
next-sitemap 사용:
- 정적 페이지: 자동 수집
- 프로그래매틱 페이지: generateStaticParams에서 자동 생성
- 우선순위:
  - 홈: 1.0
  - 계산기 메인 페이지: 0.9
  - 프로그래매틱 서브 페이지: 0.7
  - 필수 페이지 (About 등): 0.5
- changefreq:
  - 계산기: monthly
  - 프로그래매틱: monthly
  - 필수 페이지: yearly
```

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://utilverse.info/sitemap.xml

# 불필요한 크롤링 차단
Disallow: /api/
```

### 내부 링크 전략

```
모든 계산기 페이지 하단에 "Related Tools" 섹션:
- EV Charging Calculator → Air Fryer Calculator, 3D Printing Calculator
- Air Fryer Calculator → Unit Converter, EV Calculator
- 프로그래매틱 페이지 → 메인 계산기 + 관련 음식/단위 페이지

Footer에 전체 툴 링크 목록.
Breadcrumb으로 계층 구조 명시.
```

---

## 다지역 SEO 전략

### 언어
- 전체 사이트 영어 단일 언어 (다국어 번역 없음)
- 이유: 영어가 글로벌 공용어, 유럽/중국 EV 사용자도 영어 검색 빈번, 번역 유지보수 비용 회피

### 지역별 키워드 타겟

| 지역 | 타겟 키워드 예시 |
|------|----------------|
| 미국 | "ev charging cost calculator", "how much to charge tesla" |
| 영국 | "ev charging cost uk", "electric car charging cost calculator" |
| 유럽 | "ev charging cost europe", "electric car charging cost germany" |
| 호주 | "ev charging cost australia", "electric car running cost calculator" |
| 글로벌 | "ev vs gas cost comparison", "electric car savings calculator" |

### hreflang
- 단일 언어이므로 hreflang 불필요
- 대신 콘텐츠 내에서 지역별 데이터를 자연스럽게 언급하여 지역 키워드 커버

---

## 프로그래매틱 SEO 전략

### Air Fryer 음식별 페이지 (Phase 2~3)

```
/air-fryer-calculator/chicken-wings
/air-fryer-calculator/french-fries
/air-fryer-calculator/salmon
... (50~100개)

각 페이지 구조:
- H1: "Air Fryer [Food] — Time, Temperature & Tips"
- 즉답 박스: 온도 + 시간 (Featured Snippet 타겟)
- 변환 계산기 임베딩
- 팁 3개
- FAQ 3개 (FAQPage 스키마)
- 관련 음식 내부 링크 5개
```

### 단위 변환 페이지 (Phase 3)

```
/unit-converter/kg-to-lbs
/unit-converter/cm-to-inches
/unit-converter/celsius-to-fahrenheit
... (30~50개)

각 페이지 구조:
- H1: "[From] to [To] Converter"
- 즉답: 1 [from] = X [to]
- 양방향 변환 입력
- 변환 테이블 (1~100 단위)
- 설명 텍스트 200자+
- 관련 변환 내부 링크
```

---

## 콘텐츠 캘린더 (Phase 0~1)

### Phase 0 (Week 1~2): 필수 페이지

| 페이지 | 분량 | 핵심 내용 |
|--------|------|----------|
| /about | 600자+ | 사이트 미션, 운영자 소개, 데이터 소스 투명성 |
| /privacy-policy | 1000자+ | AdSense/GA4 데이터 수집, GDPR/CCPA, 쿠키 정책 |
| /terms | 800자+ | 면책조항, 이용약관, 계산 결과 정확성 고지 |
| /contact | 300자+ | Formspree 이메일 폼, 응답 시간 안내 |

### Phase 1 (Week 3~4): EV Calculator SEO 콘텐츠

| 콘텐츠 | 분량 | 목적 |
|--------|------|------|
| 가이드 텍스트 | 800자+ | 충전 비용 산정 방법 설명, 키워드 자연 삽입 |
| FAQ 7개 | 각 100자+ | FAQPage 스키마, Featured Snippet 타겟 |
| OG 이미지 | 1200×630px | SNS 공유 시 시각적 임팩트 |

---

## 백링크 전략 (Phase 5)

| 방법 | 타겟 | 기대 DA |
|------|------|---------|
| Product Hunt 등록 | 계산기 도구 카테고리 | 90+ |
| Reddit 공유 | r/electricvehicles, r/teslamotors, r/evs | 소셜 시그널 |
| Free Tool 디렉토리 | toolify.ai, saashub.com, nichetools.net | 30~60 |
| GitHub README | 프로젝트 오픈소스 부분 공개 | 100 |
| 개인 블로그/Medium | 개발 스토리 포스트 | 자연 백링크 |

---

## 성과 측정 KPI

| KPI | 도구 | Phase 0~1 목표 | Phase 4 목표 |
|-----|------|---------------|-------------|
| 인덱싱 페이지 수 | GSC | 10+ | 100+ |
| 주간 노출 수 | GSC | 100+ | 1,000+ |
| 일일 오가닉 클릭 | GSC | 5+ | 50+ |
| 월 PV | GA4 | 500+ | 10,000+ |
| 바운스율 | GA4 | < 70% | < 60% |
| 평균 체류시간 | GA4 | > 1분 | > 2분 |
| Core Web Vitals | PageSpeed | 모두 통과 | 모두 통과 |
