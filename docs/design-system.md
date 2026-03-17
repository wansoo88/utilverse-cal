# utilverse.info 디자인 시스템

## 브랜드 아이덴티티

### 브랜드 성격
- 신뢰할 수 있는 도구 — 정확한 계산, 깔끔한 결과
- 친근하지만 전문적 — 복잡한 데이터를 쉽게 풀어줌
- 모던하고 세련된 — "이거 진짜 무료야?" 느낌

### 브랜드 네임 처리
- 로고 텍스트: **utilverse** (소문자, 볼드)
- 서브텍스트: 없음 (로고만으로 충분)
- 파비콘: "U" 글자를 브랜드 그라디언트로 처리

---

## 컬러 시스템

### 디자인 철학
계산기 사이트는 "데이터 시각화"가 핵심이다. 차트와 숫자가 돋보이려면 배경은 절제하고, 액센트 컬러로 시선을 유도해야 한다. Electric Blue → Emerald Green 그라디언트를 메인 액센트로 사용해서 "전기/에너지/친환경"이라는 EV 테마와 자연스럽게 연결한다.

### 라이트 모드

| 역할 | 컬러 | Hex | 용도 |
|------|------|-----|------|
| Background | Snow White | `#FAFBFC` | 페이지 배경 |
| Surface | Pure White | `#FFFFFF` | 카드, 입력 영역 |
| Surface Elevated | Soft Gray | `#F3F4F6` | 호버 상태, 비활성 영역 |
| Text Primary | Charcoal | `#1A1A2E` | 본문 텍스트 |
| Text Secondary | Slate | `#64748B` | 보조 텍스트, 라벨 |
| Text Muted | Light Slate | `#94A3B8` | 플레이스홀더, 비활성 |
| Border | Cool Gray | `#E2E8F0` | 카드 테두리, 구분선 |
| Accent Primary | Electric Blue | `#3B82F6` | CTA 버튼, 링크, 활성 상태 |
| Accent Secondary | Emerald | `#10B981` | 절감액, 긍정 지표, 성공 |
| Accent Gradient | Blue → Emerald | `#3B82F6 → #10B981` | 히어로 섹션, 주요 결과 강조 |
| Warning | Amber | `#F59E0B` | 경고, 주의 |
| Danger | Rose | `#EF4444` | 에러, 비용 증가 |
| Chart Blue | Soft Blue | `#60A5FA` | 차트 EV 비용 |
| Chart Orange | Warm Orange | `#FB923C` | 차트 가솔린 비용 |
| Chart Green | Mint | `#34D399` | 차트 절감액 |

### 다크 모드

| 역할 | 컬러 | Hex |
|------|------|-----|
| Background | Deep Navy | `#0F172A` |
| Surface | Dark Slate | `#1E293B` |
| Surface Elevated | Slate | `#334155` |
| Text Primary | Off White | `#F1F5F9` |
| Text Secondary | Cool Gray | `#94A3B8` |
| Text Muted | Dark Gray | `#64748B` |
| Border | Dark Border | `#334155` |
| Accent Primary | Bright Blue | `#60A5FA` |
| Accent Secondary | Light Emerald | `#34D399` |
| Accent Gradient | `#60A5FA → #34D399` | 그라디언트 밝기 조정 |

### CSS 변수 구현

```css
:root {
  --background: 210 40% 98%;
  --foreground: 234 30% 14%;
  --card: 0 0% 100%;
  --card-foreground: 234 30% 14%;
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 160 84% 39%;
  --secondary-foreground: 0 0% 100%;
  --muted: 220 14% 96%;
  --muted-foreground: 215 16% 47%;
  --accent: 217 91% 60%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --border: 214 32% 91%;
  --ring: 217 91% 60%;
  --radius: 0.625rem;
}

.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --card: 217 33% 17%;
  --card-foreground: 210 40% 98%;
  --primary: 213 94% 68%;
  --primary-foreground: 222 47% 11%;
  --secondary: 160 60% 52%;
  --secondary-foreground: 222 47% 11%;
  --muted: 217 19% 27%;
  --muted-foreground: 215 20% 65%;
  --accent: 213 94% 68%;
  --accent-foreground: 222 47% 11%;
  --destructive: 0 63% 31%;
  --border: 217 19% 27%;
  --ring: 213 94% 68%;
}
```

---

## 타이포그래피

### 폰트 선택

| 용도 | 폰트 | 이유 |
|------|------|------|
| 헤딩 | Inter (700, 600) | 깔끔한 산세리프, 숫자 가독성 우수, 다국어 지원 |
| 본문 | Inter (400, 500) | 일관된 브랜드 느낌, 긴 텍스트 가독성 |
| 숫자/결과 | JetBrains Mono (700) | 모노스페이스로 숫자 정렬, 계산 결과 강조 |

### 타이포 스케일

```
Hero Title:     text-4xl (36px) / font-bold / tracking-tight / md:text-5xl (48px)
Page Title:     text-3xl (30px) / font-bold / tracking-tight
Section Title:  text-2xl (24px) / font-semibold
Card Title:     text-lg (18px) / font-semibold
Body:           text-base (16px) / font-normal / leading-relaxed
Small:          text-sm (14px) / font-normal
Caption:        text-xs (12px) / font-medium / uppercase / tracking-wider
Result Number:  text-5xl (48px) / font-bold / font-mono (JetBrains Mono)
```

---

## 간격 및 레이아웃

### 그리드
- 최대 너비: `max-w-6xl` (1152px) — 계산기 콘텐츠에 적합한 너비
- 패딩: `px-4 sm:px-6 lg:px-8`
- 섹션 간격: `py-12 md:py-16 lg:py-20`

### 카드
- 패딩: `p-6 md:p-8`
- 라운딩: `rounded-xl` (10px)
- 그림자 (라이트): `shadow-sm hover:shadow-md transition-shadow`
- 그림자 (다크): `shadow-none border border-border`
- 배경: `bg-card`

### 입력 영역
- 높이: `h-11` (44px) — 모바일 터치 타겟 최소 기준
- 라운딩: `rounded-lg` (8px)
- 포커스 링: `ring-2 ring-primary/20`

---

## 컴포넌트 스타일 가이드

### 버튼

```
Primary:    bg-primary text-primary-foreground hover:bg-primary/90
            rounded-lg px-6 py-3 font-semibold
            그라디언트 변형: bg-gradient-to-r from-blue-500 to-emerald-500

Secondary:  bg-secondary/10 text-secondary hover:bg-secondary/20
            rounded-lg px-6 py-3 font-medium

Ghost:      bg-transparent hover:bg-muted
            rounded-lg px-4 py-2 font-medium

Outline:    border border-border bg-transparent hover:bg-muted
            rounded-lg px-6 py-3 font-medium
```

### 계산 결과 카드 (핵심 컴포넌트)

```
결과 카드는 사이트의 "돈 되는" 순간이다.
사용자가 계산 버튼을 누르고 결과를 보는 그 순간이 체류시간과 재방문을 결정한다.

구조:
┌─────────────────────────────────────────┐
│  Monthly Charging Cost                  │
│                                         │
│  $47.20                                 │  ← 큰 숫자, font-mono, text-5xl
│  ──────────────────                     │     그라디언트 텍스트 (blue → emerald)
│  Based on 1,000 mi/month               │  ← text-sm, text-muted
│                                         │
│  ┌──────────┐ ┌──────────┐             │
│  │ Annual   │ │ 5-Year   │             │
│  │ $566.40  │ │ $2,832   │             │
│  └──────────┘ └──────────┘             │
│                                         │
│  You save $1,240/year vs gas ✓          │  ← text-secondary (emerald), 강조
│                                         │
│  [Share] [Save as PDF]                  │
└─────────────────────────────────────────┘

스타일:
- 배경: bg-card with subtle gradient border (1px)
- 큰 숫자: bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent
- 절감액: text-secondary font-semibold
- 애니메이션: 숫자 카운트업 (0 → 47.20, 800ms ease-out)
```

### 차트 스타일

```
EV vs Gas 비교 바 차트:
- EV 바: fill-[#60A5FA] (Chart Blue)
- Gas 바: fill-[#FB923C] (Chart Orange)
- 절감액 영역: fill-[#34D399] (Chart Green)
- 배경 그리드: stroke-border, 점선
- 라벨: text-muted-foreground, text-sm
- 다크모드: 동일 컬러, 배경만 전환

파이 차트 (3D Printing 비용 분석):
- 재료비: #60A5FA
- 전기비: #F59E0B
- 감가상각: #8B5CF6
- 실패 마진: #EF4444
```

### 맵 스타일

```
충전소 맵:
- 맵 컨테이너: rounded-xl overflow-hidden border border-border
- 높이: h-[400px] md:h-[500px]
- 마커 색상:
  - Level 2: #3B82F6 (blue)
  - DC Fast: #F59E0B (amber)
  - Tesla Supercharger: #EF4444 (red)
  - Free: #10B981 (emerald)
- 팝업: bg-card rounded-lg shadow-lg p-4
- 다크모드: CartoDB Dark Matter 타일 사용
  - 라이트: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
  - 다크: https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
```

---

## 인터랙션 & 애니메이션

### 원칙
- 빠르고 자연스럽게. 화려한 애니메이션보다 반응성이 중요
- 계산 결과는 즉시 업데이트 (디바운스 200ms)
- 페이지 전환은 부드럽게

### 구체적 애니메이션

| 요소 | 애니메이션 | 시간 |
|------|-----------|------|
| 결과 숫자 | 카운트업 (0 → 최종값) | 800ms ease-out |
| 카드 호버 | translateY(-2px) + shadow 증가 | 200ms |
| 차트 바 | 높이 0 → 최종 높이 | 600ms ease-out, 순차 딜레이 100ms |
| 맵 로딩 | 스켈레톤 → 페이드인 | 300ms |
| 다크모드 전환 | 전체 컬러 트랜지션 | 200ms |
| 슬라이더 드래그 | 결과 실시간 업데이트 | 즉시 (디바운스 없음) |
| FAQ 아코디언 | 높이 확장 + 페이드인 | 200ms ease-out |
| 토스트 알림 | 우하단 슬라이드인 | 300ms |

---

## 반응형 브레이크포인트

```
Mobile:   < 640px   — 단일 컬럼, 입력/결과 세로 배치
Tablet:   640~1024px — 2컬럼 (입력 | 결과)
Desktop:  > 1024px   — 2컬럼 + 사이드 여백, 맵 넓게
```

### 모바일 우선 설계 포인트
- 입력 폼: 전체 너비, 큰 터치 타겟 (44px+)
- 결과 카드: 입력 아래에 배치, 스크롤 시 sticky 고려
- 차트: 가로 스크롤 없이 축소 표시
- 맵: 전체 너비, 리스트 뷰 토글 (맵/리스트)
- 네비게이션: 햄버거 메뉴 (모바일), 수평 메뉴 (데스크톱)

---

## 접근성 (a11y)

- 모든 인터랙티브 요소에 키보드 네비게이션 지원 (shadcn/ui 기본 제공)
- 컬러 대비 WCAG AA 이상 (4.5:1 텍스트, 3:1 UI)
- 차트에 aria-label + 데이터 테이블 대체 텍스트
- 맵에 충전소 리스트 뷰 대체 제공 (스크린 리더 대응)
- 슬라이더에 aria-valuemin, aria-valuemax, aria-valuenow
- 포커스 링 항상 표시 (outline 제거 금지)
- prefers-reduced-motion 미디어 쿼리로 애니메이션 비활성화 옵션

---

## 페이지별 레이아웃 패턴

### 홈페이지
```
[Header — 로고 + 네비 + 다크모드 토글]
[Hero — "Free Online Calculators" + 서브텍스트 + 그라디언트 배경]
[Tool Grid — 계산기 카드 3~4개, 아이콘 + 제목 + 한 줄 설명]
[Footer — 링크 + 저작권]
```

### 계산기 페이지 (공통 패턴)
```
[Header]
[Breadcrumb — Home > EV Charging Cost Calculator]
[H1 + 서브텍스트]
[Calculator Card]
  ├── 입력부 (좌측 또는 상단)
  └── 결과부 (우측 또는 하단)
[차트 섹션]
[맵 섹션 — EV 전용, 지연 로딩]
[가이드 텍스트 — 800자+ SEO 콘텐츠]
[FAQ 아코디언]
[관련 툴 추천]
[Footer]
```

### 필수 페이지 (About, Privacy 등)
```
[Header]
[H1]
[본문 — prose 스타일, max-w-3xl 중앙 정렬]
[Footer]
```
