# EV Charging Cost Calculator — 기능 스펙

## 개요

- URL: `utilverse.info/ev-charging-cost-calculator`
- 목적: EV 충전 비용 계산 + 근처 충전소 검색을 하나의 페이지에서 제공
- 핵심 차별화: 비용 계산 + 충전소 맵 원스톱 (경쟁사 어디에도 없는 조합)
- 타겟 키워드: "ev charging cost calculator", "how much to charge electric car", "ev charging near me"

---

## 타겟 지역 및 데이터

### 지역별 지원 범위

| 지역 | 전기요금 데이터 | 통화 | 거리 단위 | EV 모델 |
|------|---------------|------|----------|---------|
| 미국 50개 주 | EIA.gov | USD ($) | miles | 전체 30대 |
| 영국 | Ofgem 공개 데이터 | GBP (£) | miles | 유럽 판매 모델 |
| 독일 | BDEW 통계 | EUR (€) | km | 유럽 판매 모델 |
| 노르웨이 | SSB 통계 | NOK (kr) | km | 유럽 판매 모델 |
| 네덜란드 | CBS 통계 | EUR (€) | km | 유럽 판매 모델 |
| 프랑스 | EDF 공개 요금 | EUR (€) | km | 유럽 판매 모델 |
| 중국 | 국가발전개혁위원회 | CNY (¥) | km | 중국 판매 모델 (BYD, NIO 등) |
| 호주 | AER 공개 데이터 | AUD (A$) | km | 호주 판매 모델 |
| 캐나다 | StatCan | CAD (C$) | km | 북미 모델 |

### EV 모델 데이터 (총 40대+)

글로벌 모델:
- Tesla Model 3, Model Y, Model S, Model X
- Hyundai Ioniq 5, Ioniq 6
- Kia EV6, EV9
- BMW iX, i4
- Mercedes EQS, EQE
- Volkswagen ID.4, ID.7
- Audi Q4 e-tron, Q8 e-tron
- Porsche Taycan
- Ford Mustang Mach-E, F-150 Lightning
- Chevy Equinox EV, Blazer EV
- Rivian R1T, R1S
- Polestar 2
- Volvo EX30, EX90
- Nissan Ariya, Leaf

중국 시장 추가:
- BYD Seal, Dolphin, Atto 3, Han
- NIO ET5, ES6
- XPeng G6, P7
- Li Auto L7

각 모델 데이터:
```json
{
  "id": "tesla-model-3-lr",
  "name": "Tesla Model 3 Long Range",
  "brand": "Tesla",
  "year": 2025,
  "batteryCapacity": 75,
  "epaEfficiency": 4.0,
  "wltpEfficiency": 6.5,
  "regions": ["us", "eu", "cn", "au", "ca"],
  "gasEquivalent": "BMW 3 Series",
  "gasEquivalentMpg": 30
}
```

---

## 입력부 상세 스펙

### 1. 지역 선택 (Region Selector)

```
[탭 또는 드롭다운]
├── 🇺🇸 United States → 50개 주 서브 선택
├── 🇬🇧 United Kingdom → 단일 평균 요금
├── 🇩🇪 Germany → 단일 평균 요금
├── 🇳🇴 Norway → 단일 평균 요금
├── 🇳🇱 Netherlands → 단일 평균 요금
├── 🇫🇷 France → 단일 평균 요금
├── 🇨🇳 China → 주요 도시별 (베이징, 상하이, 선전, 광저우)
├── 🇦🇺 Australia → 주별 (NSW, VIC, QLD 등)
└── 🇨🇦 Canada → 주별 (ON, BC, QC, AB)

지역 선택 시:
- 통화 자동 전환
- 거리 단위 자동 전환 (miles ↔ km)
- 해당 지역 판매 EV 모델만 필터링
- 전기요금 자동 입력 (사용자 커스텀 입력도 가능)
```

### 2. 차종 선택 (Vehicle Selector)

```
[검색 가능한 드롭다운 — shadcn/ui Combobox]
- 브랜드별 그룹핑 (Tesla, Hyundai, BMW...)
- 검색: "tesla" 입력 시 Tesla 모델만 필터
- 선택 시 자동 입력:
  - 배터리 용량 (kWh)
  - 효율 (mi/kWh 또는 kWh/100km)
  - 동급 가솔린 차량 + MPG/L per 100km
- "My car isn't listed" → 수동 입력 모드 전환
```

### 3. 월간 주행거리 (Mileage Slider)

```
[슬라이더 + 숫자 직접 입력]
- 범위: 100 ~ 5,000 miles (또는 160 ~ 8,000 km)
- 기본값: 지역별 평균
  - 미국: 1,000 miles/month
  - 유럽: 1,200 km/month
  - 중국: 1,500 km/month
- 스텝: 50 miles / 100 km
- 드래그 시 결과 실시간 업데이트
```

### 4. 충전 비율 (Charging Ratio)

```
[3개 슬라이더, 합계 100%]
- Home Level 2: 기본 80%
- Public Level 2: 기본 10%
- DC Fast Charging: 기본 10%

각 충전 타입별 요금:
- Home L2: 지역 전기요금 그대로
- Public L2: 지역 전기요금 × 2.5 (평균 마크업)
- DC Fast: 지역별 고정 요금 (미국 $0.30~0.50/kWh, 유럽 €0.40~0.70/kWh)

프리셋 버튼:
- "Mostly Home" (90/5/5)
- "Mixed" (60/20/20)
- "Mostly Public" (20/40/40)
- "Apartment Dweller" (0/50/50) ← 집 충전 불가 시나리오
```

---

## 출력부 상세 스펙

### 1. 주요 결과 카드

```
┌─────────────────────────────────────────────────┐
│  Your Monthly EV Charging Cost                  │
│                                                 │
│  $47.20                                         │  ← 그라디언트 텍스트, 카운트업 애니메이션
│                                                 │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ Annual     │ │ 5-Year     │ │ vs Gas     │  │
│  │ $566.40    │ │ $2,832     │ │ Save $1,240│  │
│  │            │ │            │ │ /year      │  │
│  └────────────┘ └────────────┘ └────────────┘  │
└─────────────────────────────────────────────────┘
```

### 2. 비용 분석 (Cost Breakdown)

```
충전 타입별 월간 비용:
- Home L2:    $37.76  (80%)
- Public L2:  $4.72   (10%)
- DC Fast:    $4.72   (10%)

표시: 수평 스택 바 차트 (3색)
```

### 3. EV vs Gas 비교 차트

```
[Recharts 바 차트]
- X축: Monthly / Annual / 5-Year
- Y축: 비용 ($)
- 바: EV (blue) vs Gas (orange)
- 절감액 라벨: 각 바 위에 차이 표시
- 하단 텍스트: "Driving a [Model] saves you $X,XXX over 5 years compared to [Gas Equivalent]"
```

### 4. CO₂ 절감량

```
┌──────────────────────────────────┐
│  🌱 Environmental Impact        │
│                                  │
│  Annual CO₂ Saved: 4.2 tons     │
│  Equivalent to: 105 trees       │
│                                  │
│  [Share on Twitter] [Share on FB]│
└──────────────────────────────────┘

계산 로직:
- 가솔린 CO₂: 주행거리 / MPG × 8.887 kg CO₂/gallon
- EV CO₂: 주행거리 / 효율 × 지역 그리드 배출계수 (EPA eGRID)
- 절감량 = 가솔린 CO₂ - EV CO₂
- 나무 환산: 절감량 / 21.77 kg CO₂/tree/year
```

---

## 충전소 맵 (Charger Finder Map)

### 위치

페이지 하단, "Find EV Chargers Near You" 섹션.
IntersectionObserver로 뷰포트 진입 시에만 로딩.

### 위치 입력

```
[위치 입력 바]
┌──────────────────────────────────────────────┐
│ 📍 [Use My Location]  or  [Enter ZIP / City] │
│                                              │
│ Radius: [10 mi ▼]  [25 mi]  [50 mi]         │
└──────────────────────────────────────────────┘

- "Use My Location": Browser Geolocation API
- ZIP/City: 텍스트 입력 → Nominatim 무료 지오코딩
- 반경: 10/25/50 miles (또는 km)
```

### 필터 바

```
[필터 토글 버튼 그룹]
- ⚡ Level 2        (파란색)
- ⚡⚡ DC Fast      (앰버)
- 🔴 Tesla Supercharger (빨간색)
- 🟢 Free Charging  (초록색)
- All (기본 선택)
```

### 맵 표시

```
- 마커: 충전 타입별 색상 구분 (위 필터 색상과 동일)
- 클러스터링: 줌 아웃 시 마커 그룹핑 (Leaflet.markercluster)
- 마커 클릭 시 팝업:
  ┌──────────────────────────┐
  │ ChargePoint Station      │
  │ 123 Main St, San Jose    │
  │                          │
  │ Type: DC Fast (150kW)    │
  │ Connector: CCS, CHAdeMO  │
  │ Cost: $0.32/kWh          │
  │ Status: Available        │
  │                          │
  │ [Get Directions ↗]       │
  └──────────────────────────┘
```

### 리스트 뷰 (모바일 대응)

```
맵 아래 또는 토글로 전환 가능한 리스트:
- 거리순 정렬
- 각 항목: 이름, 주소, 거리, 충전 타입, 요금
- 클릭 시 맵에서 해당 마커 하이라이트
```

### 기술 구현

```typescript
// 지연 로딩
const ChargerFinderMap = dynamic(
  () => import('@/components/ev/charger-finder-map'),
  { ssr: false, loading: () => <MapSkeleton /> }
)

// OCM API 호출
const fetchChargers = async (lat: number, lng: number, radius: number) => {
  const res = await fetch(
    `https://api.openchargemap.io/v3/poi/?` +
    `latitude=${lat}&longitude=${lng}` +
    `&distance=${radius}&distanceunit=Miles` +
    `&maxresults=100&compact=true&verbose=false` +
    `&key=${process.env.NEXT_PUBLIC_OCM_API_KEY}`
  )
  return res.json()
}
```

---

## 계산 로직

### 월간 충전 비용

```
monthlyKwh = monthlyMiles / efficiency(mi/kWh)

homeCost    = monthlyKwh × homeRatio × electricityRate
publicCost  = monthlyKwh × publicRatio × electricityRate × publicMarkup
dcFastCost  = monthlyKwh × dcFastRatio × dcFastRate

totalMonthlyCost = homeCost + publicCost + dcFastCost
```

### 가솔린 비교

```
monthlyGallons = monthlyMiles / gasEquivalentMpg
monthlyGasCost = monthlyGallons × gasPricePerGallon
```

### 유럽/중국 단위 변환

```
km → miles: × 0.621371
kWh/100km → mi/kWh: 100 / (kWh/100km × 1.60934)
L/100km → MPG: 235.215 / L/100km
```

---

## SEO 콘텐츠

### H1
"EV Charging Cost Calculator — How Much Does It Cost to Charge Your Electric Car?"

### 가이드 텍스트 (800자+)
페이지 하단, 계산기와 맵 아래에 배치. 자연스러운 톤으로 작성:
- 충전 비용에 영향을 미치는 요소 설명
- Home vs Public vs DC Fast 비용 차이
- 지역별 전기요금 차이가 미치는 영향
- 충전 습관 최적화 팁

### FAQ (7개, FAQPage 스키마)

1. How much does it cost to charge a Tesla at home?
2. Is it cheaper to charge an EV at home or at a public station?
3. How much electricity does an EV use per month?
4. What is the average cost per kWh in the US?
5. How do EV charging costs compare to gas?
6. Where are the nearest EV charging stations?
7. How much does it cost to use a public EV charger?

### 구조화 데이터

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "EV Charging Cost Calculator",
  "url": "https://utilverse.info/ev-charging-cost-calculator",
  "applicationCategory": "UtilityApplication",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

---

## 사용자 경험 흐름

```
1. 페이지 진입
   → 지역 자동 감지 시도 (Geolocation API)
   → 감지 성공: 해당 지역 자동 선택
   → 감지 실패: 미국 California 기본값

2. 차종 선택
   → 배터리/효율 자동 입력
   → 가솔린 비교 차량 자동 매칭

3. 슬라이더 조정
   → 결과 실시간 업데이트 (디바운스 없음)
   → 차트 애니메이션 업데이트

4. 결과 확인
   → 월간/연간/5년 비용 한눈에
   → EV vs Gas 차트로 시각적 비교
   → CO₂ 절감량으로 감성 자극

5. 충전소 검색 (스크롤 다운)
   → 맵 지연 로딩
   → 현재 위치 기반 충전소 표시
   → 필터로 원하는 충전소 타입 선택
   → 마커 클릭으로 상세 정보 확인

6. 공유/재방문
   → SNS 공유 (CO₂ 절감량 강조)
   → 북마크 → "내 근처 충전소" 재방문
```

---

## 성능 목표

| 지표 | 목표 |
|------|------|
| LCP | < 2.0s |
| FID | < 100ms |
| CLS | < 0.05 |
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse SEO | 100 |
| 맵 로딩 (지연) | < 1.5s (뷰포트 진입 후) |
| 계산 응답 | < 50ms (클라이언트 사이드) |
