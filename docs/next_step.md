# Next Steps — Non-Implementation Tasks

> 구현 완료 후 남은 외부 액션 목록. 코드 작업 없이 수동으로 진행해야 하는 항목들.

---

## Phase 4: AdSense 재신청

### 체크리스트
- [ ] Google AdSense 재신청 (https://www.google.com/adsense)
  - 현재 사이트 상태: 120개+ 정적 페이지, 800자+ 가이드 텍스트, FAQ 스키마 완비
  - `NEXT_PUBLIC_ADSENSE_CLIENT` 환경변수에 발급된 클라이언트 ID 설정
  - `components/analytics/adsense.tsx` 컴포넌트 이미 구현됨 — ID만 넣으면 활성화
- [ ] 승인 후 각 페이지 결과 하단에 `<AdSlot slot="YOUR_SLOT_ID" />` 삽입
- [ ] Bing Webmaster Tools 등록 (https://www.bing.com/webmasters)

### AdSense 거절 시 대응
| 거절 사유 | 대응 |
|----------|------|
| Insufficient content | 이미 120개+ 페이지 — 30일 후 재신청 |
| Low value content | 각 페이지 가이드 텍스트 추가 보강 |
| Policy violation | Privacy Policy 재검토 |

---

## Phase 4: Amazon Associates 제휴

- [ ] Amazon Associates 가입 (https://affiliate-program.amazon.com)
- [ ] 승인 후 `components/affiliate/affiliate-links.tsx`의 URL에서 `tag=utilverse-20` 부분을 실제 태그로 교체
  - EV 충전기 링크 3개 (EV Charging Calculator 페이지)
  - 필라멘트 링크 3개 (3D Printing Calculator 페이지)
- [ ] 실제 ASIN으로 제품 URL 업데이트 (현재 일부 placeholder URL 포함)

---

## Phase 1 잔여: 테스트 & 배포

- [ ] `.env.local`에 `NEXT_PUBLIC_OCM_API_KEY` 설정
  - 발급: https://openchargemap.org/site/develop/api (무료)
  - 설정 후 EV Charging Calculator 맵 실제 동작 확인
- [ ] Vercel 환경변수 설정 (Production)
  - `NEXT_PUBLIC_GA_ID` — Google Analytics 4 측정 ID
  - `NEXT_PUBLIC_ADSENSE_CLIENT` — AdSense 클라이언트 ID (승인 후)
  - `NEXT_PUBLIC_OCM_API_KEY` — Open Charge Map API 키
  - `NEXT_PUBLIC_FORMSPREE_ID` — Contact 폼 Formspree ID
- [ ] Vercel 배포 후 프로덕션 URL 확인
- [ ] OG 이미지 미리보기 확인 (https://cards-dev.twitter.com/validator)
- [ ] Lighthouse 성능 체크 (90+ 목표)
- [ ] 모바일 반응형 최종 테스트 (320px ~ 1440px)

---

## Phase 5: 백링크 캠페인

### 즉시 실행 가능 (무료, 낮은 난이도)
- [ ] Reddit 공유
  - r/electricvehicles — EV Charging Calculator + EV vs Gas Calculator
  - r/3Dprinting — 3D Printing Cost Calculator
  - r/airfryer — Air Fryer Calculator
  - r/personalfinance — EV vs Gas TCO Calculator
- [ ] Free Tool Directory 등록 (각 10분 이내)
  - https://toolify.ai
  - https://nichetools.net
  - https://saashub.com
  - https://alternativeto.net
  - https://www.producthunt.com (별도 런치 준비 필요)
- [ ] GitHub README에 utilverse.info 링크 추가

### 중간 난이도
- [ ] Product Hunt 런치 준비
  - 런치 날짜: 화요일 오전 12:01 AM PST 권장
  - 헌터 섭외 또는 셀프 런치
  - 런치 전 지지자 확보 (Twitter/X, LinkedIn)
- [ ] Medium/Dev.to 포스트: "How I Built a Free EV Cost Calculator with Next.js"
  - 자연스러운 백링크 + 개발자 커뮤니티 노출

---

## Phase 6: GSC 인덱싱 요청

- [ ] Google Search Console에서 주요 URL 인덱싱 요청
  - https://utilverse.info/ev-charging-cost-calculator
  - https://utilverse.info/ev-vs-gas-calculator
  - https://utilverse.info/air-fryer-calculator
  - https://utilverse.info/3d-printing-cost-calculator
  - https://utilverse.info/unit-converter
- [ ] Sitemap 재제출 (빌드 후 자동 생성됨: /sitemap-0.xml)
- [ ] 인덱싱 현황 주 1회 모니터링

---

## 데이터 업데이트 (주기적)

| 데이터 | 파일 | 업데이트 주기 | 소스 |
|--------|------|-------------|------|
| 미국 전기요금 | `data/electricity-rates.json` | 분기 | EIA.gov |
| 가솔린 가격 | `data/gas-prices.json` | 월간 | EIA.gov |
| EV 모델 스펙 | `data/ev-models.json` | 연간 | fueleconomy.gov |
| 필라멘트 가격 | `data/filaments.json` | 반기 | Amazon 시세 |

---

## 수익 모니터링 (Phase 6)

- [ ] GA4 대시보드 설정 (주요 이벤트: 계산기 사용, 제휴 링크 클릭)
- [ ] GSC 노출/클릭 주간 리뷰
- [ ] AdSense RPM 모니터링 (목표: $3+)
- [ ] Amazon Associates 클릭/전환 추적
