# Phase 1 구현 상세 — EV Charging Cost Calculator

## 목표
첫 번째 킬러 계산기 배포. 비용 계산 + 충전소 맵 원스톱 페이지.
GSC 인덱싱 시작, 오가닉 트래픽 첫 유입.

## 기간
Week 3~4

## 선행 조건
- Phase 0 완료 (레이아웃, 필수 페이지, SEO 인프라)
- Open Charge Map API 키 발급 완료

---

## Week 3: 데이터 + 계산기 UI

### 1. 데이터 수집 및 JSON 구축

data/ev-models.json:
```
- 40대+ EV 모델 스펙 수집
- 소스: fueleconomy.gov (미국), WLTP 공식 데이터 (유럽)
- 필드: id, name, brand, year, batteryCapacity, epaEfficiency, wltpEfficiency, regions, gasEquivalent, gasEquivalentMpg
- 브랜드별 정렬
```

data/state-rates.json:
```
- 미국 50개 주 평균 전기요금 ($/kWh)
- 소스: EIA Electric Power Monthly (최신 월간 데이터)
- 필드: stateCode, stateName, residentialRate, commercialRate
```

data/eu-rates.json:
```
- 유럽 주요국 전기요금
- 소스: Eurostat, 각국 에너지 규제기관
- 필드: countryCode, countryName, currency, residentialRate, dcFastRate
```

data/cn-rates.json:
```
- 중국 주요 도시 전기요금
- 소스: 국가발전개혁위원회 공개 데이터
- 필드: cityCode, cityName, residentialRate, dcFastRate
```

data/gas-prices.json:
```
- 지역별 평균 가솔린 가격
- 미국: 주별 (EIA.gov)
- 유럽: 국가별
- 중국: 도시별
```

### 2. 계산 로직 구현

lib/calculations/ev-charging.ts:
```typescript
interface CalculationInput {
  vehicle: EVModel
  region: Region
  monthlyDistance: number        // miles 또는 km
  distanceUnit: 'miles' | 'km'
  chargingRatio: {
    home: number                // 0~1
    publicL2: number
    dcFast: number
  }
  customElectricityRate?: number // 사용자 커스텀 요금
}

interface CalculationResult {
  monthlyCost: number
  annualCost: number
  fiveYearCost: number
  monthlyGasCost: number
  annualGasSavings: number
  fiveYearGasSavings: number
  annualCO2Saved: number        // kg
  treesEquivalent: number
  costBreakdown: {
    home: number
    publicL2: number
    dcFast: number
  }
  currency: string
}
```

lib/calculations/ev-vs-gas.ts:
```
- 가솔린 비용 계산 (주행거리 / MPG × 가솔린 가격)
- CO₂ 계산 (EPA 배출계수 기반)
- 나무 환산 (21.77 kg CO₂/tree/year)
```

lib/utils/format.ts:
```
- formatCurrency(amount, currency): "$47.20", "€38.50", "¥245"
- formatNumber(num): "1,000", "47.20"
- formatDistance(distance, unit): "1,000 mi", "1,600 km"
- formatCO2(kg): "4.2 tons"
```

### 3. 입력 컴포넌트 구현

components/ev/region-selector.tsx:
```
- 탭 UI: 국가 플래그 + 이름
- 미국 선택 시 → 주 드롭다운 표시
- 중국 선택 시 → 도시 드롭다운 표시
- 호주/캐나다 선택 시 → 주/프로빈스 드롭다운 표시
- 유럽 국가 선택 시 → 단일 평균 요금 적용
- 선택 시 통화/단위 자동 전환
- 커스텀 요금 입력 토글
```

components/ev/vehicle-selector.tsx:
```
- shadcn/ui Combobox (검색 가능 드롭다운)
- 브랜드별 그룹핑
- 선택한 지역에서 판매되는 모델만 필터
- 선택 시 배터리/효율 자동 입력
- "My car isn't listed" → 수동 입력 모드
```

components/ev/mileage-slider.tsx:
```
- shadcn/ui Slider
- 범위: 지역별 자동 조정 (miles/km)
- 숫자 직접 입력도 가능
- 드래그 시 결과 실시간 업데이트
```

components/ev/charging-ratio.tsx:
```
- 3개 슬라이더 (합계 100% 자동 조정)
- 프리셋 버튼 4개
- 각 타입별 요금 표시
```

### 4. 결과 컴포넌트 구현

components/ev/cost-result.tsx:
```
- 메인 결과 카드 (월간 비용, 큰 숫자, 그라디언트)
- 연간/5년 서브 카드
- 절감액 강조 (emerald 컬러)
- 숫자 카운트업 애니메이션
```

components/ev/cost-chart.tsx:
```
- Recharts BarChart
- EV vs Gas 비교 (월간/연간/5년)
- 반응형 (ResponsiveContainer)
- 다크모드 대응 (컬러 자동 전환)
```

components/ev/savings-summary.tsx:
```
- CO₂ 절감량 카드
- 나무 환산
- SNS 공유 버튼 (Twitter, Facebook)
```

### 5. 메인 페이지 조립

app/ev-charging-cost-calculator/page.tsx:
```
- SSG (export const dynamic = 'force-static')
- 메타데이터 설정 (title, description, OG, JSON-LD)
- 컴포넌트 배치:
  1. H1 + 서브텍스트
  2. Calculator Card (입력 + 결과)
  3. 차트 섹션
  4. 맵 섹션 (Week 4)
  5. 가이드 텍스트
  6. FAQ 아코디언
  7. 관련 툴
```

---

## Week 4: 충전소 맵 + SEO + 배포

### 6. 충전소 맵 구현

```bash
pnpm add leaflet react-leaflet
pnpm add -D @types/leaflet
```

lib/api/open-charge-map.ts:
```
- fetchNearbyChargers(lat, lng, radius, filters)
- 응답 파싱: 주소, 커넥터 타입, 전력, 요금, 운영사
- 에러 핸들링 (API 다운 시 graceful fallback)
```

components/ev/charger-finder-map.tsx:
```
- dynamic import (ssr: false)
- IntersectionObserver로 뷰포트 진입 시 로딩
- 로딩 중: 스켈레톤 UI
- 다크모드: CartoDB Dark Matter 타일 자동 전환
```

components/ev/location-input.tsx:
```
- "Use My Location" 버튼 (Geolocation API)
- ZIP/City 텍스트 입력 (Nominatim 지오코딩)
- 반경 선택 (10/25/50)
```

components/ev/charger-filter.tsx:
```
- 토글 버튼 그룹 (Level 2, DC Fast, Tesla, Free)
- 필터 변경 시 마커 실시간 업데이트
```

components/ev/charger-marker.tsx:
```
- 충전 타입별 색상 마커
- 클릭 시 팝업 (운영사, 주소, 커넥터, 요금, 상태)
- "Get Directions" 링크 (Google Maps 연결)
```

components/ev/charger-list.tsx:
```
- 맵 아래 리스트 뷰
- 거리순 정렬
- 모바일에서 맵/리스트 토글
- 접근성: 스크린 리더용 대체 뷰
```

### 7. SEO 콘텐츠

가이드 텍스트 (800자+):
```
- 충전 비용에 영향을 미치는 3가지 요소
- Home vs Public vs DC Fast 비용 차이 설명
- 지역별 전기요금 차이
- 충전 습관 최적화 팁
- 톤: 캐주얼, 친근, 구체적 숫자 포함
```

FAQ 7개:
```
1. How much does it cost to charge a Tesla at home?
2. Is it cheaper to charge an EV at home or at a public station?
3. How much electricity does an EV use per month?
4. What is the average cost per kWh in the US?
5. How do EV charging costs compare to gas?
6. Where are the nearest EV charging stations?
7. How much does it cost to use a public EV charger?

각 답변: 100~200자, 구체적 숫자 포함, FAQPage 스키마 마크업
```

JSON-LD 스키마:
```
- WebApplication 스키마
- FAQPage 스키마
- BreadcrumbList 스키마
```

### 8. 테스트 및 배포

```
테스트:
  [ ] 모든 지역 선택 시 통화/단위 정상 전환
  [ ] 차종 선택 시 데이터 자동 입력
  [ ] 슬라이더 드래그 시 결과 실시간 업데이트
  [ ] 충전 비율 합계 100% 유지
  [ ] 맵 지연 로딩 정상 동작
  [ ] 충전소 마커 클릭 시 팝업 표시
  [ ] 다크모드 전체 컴포넌트 정상 표시
  [ ] 모바일 반응형 (320px ~ 1440px)
  [ ] 키보드 네비게이션 (Tab, Enter, Escape)
  [ ] Lighthouse 90+ 확인

배포:
  [ ] Vercel 빌드 성공
  [ ] 프로덕션 URL 확인
  [ ] GSC 인덱싱 요청
  [ ] OG 이미지 미리보기 확인 (Twitter Card Validator)
```

---

## 완료 체크리스트

```
데이터:
  [ ] ev-models.json (40대+)
  [ ] state-rates.json (미국 50개 주)
  [ ] eu-rates.json (유럽 6개국)
  [ ] cn-rates.json (중국 4개 도시)
  [ ] gas-prices.json (지역별)

계산 로직:
  [ ] 월간/연간/5년 충전 비용
  [ ] EV vs Gas 비교
  [ ] CO₂ 절감량
  [ ] 다지역 단위 변환

UI 컴포넌트:
  [ ] 지역 선택기
  [ ] 차종 선택기
  [ ] 주행거리 슬라이더
  [ ] 충전 비율 입력
  [ ] 결과 카드 (카운트업 애니메이션)
  [ ] EV vs Gas 바 차트
  [ ] CO₂ 절감 카드
  [ ] 충전소 맵 (Leaflet)
  [ ] 충전소 필터
  [ ] 충전소 리스트

SEO:
  [ ] 메타태그 (title, description, OG, Twitter)
  [ ] JSON-LD (WebApplication, FAQPage, Breadcrumb)
  [ ] 가이드 텍스트 800자+
  [ ] FAQ 7개
  [ ] 내부 링크 (홈 ↔ 계산기)

성능:
  [ ] 맵 지연 로딩 동작
  [ ] Lighthouse Performance 90+
  [ ] LCP < 2.0s
  [ ] CLS < 0.05
```
