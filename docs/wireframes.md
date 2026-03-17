# UI 와이어프레임

## 공통 레이아웃

### Header (데스크톱)

```
┌──────────────────────────────────────────────────────────────────┐
│  utilverse                    Tools ▼  |  About  |  Contact  🌙 │
│  ─────────                                                       │
│  (gradient text)              (dropdown)              (dark toggle)│
└──────────────────────────────────────────────────────────────────┘
```

### Header (모바일)

```
┌──────────────────────────────┐
│  utilverse              ☰  🌙│
└──────────────────────────────┘

☰ 클릭 시 Sheet (좌측 슬라이드):
┌──────────────────┐
│  Tools            │
│    EV Charging    │
│    Air Fryer      │
│    3D Printing    │
│  About            │
│  Contact          │
│                   │
│  ─────────────── │
│  © 2026 utilverse │
└──────────────────┘
```

### Footer

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Tools              Company           Legal                      │
│  EV Charging        About             Privacy Policy             │
│  Air Fryer          Contact           Terms of Service           │
│  3D Printing                                                     │
│  Unit Converter                                                  │
│                                                                  │
│  ─────────────────────────────────────────────────────────────── │
│  © 2026 utilverse.info. All rights reserved.                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 홈페이지

### 데스크톱

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│              Free Online Calculators & Tools                     │
│                                                                  │
│         Accurate, fast, and beautifully simple.                  │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │  ⚡               │  │  🍳               │  │  🖨️               │ │
│  │  EV Charging     │  │  Air Fryer       │  │  3D Printing    │ │
│  │  Cost Calculator │  │  Calculator      │  │  Cost Calculator│ │
│  │                  │  │                  │  │                 │ │
│  │  Calculate your  │  │  Convert oven    │  │  Estimate your  │ │
│  │  monthly EV      │  │  recipes for     │  │  3D print costs │ │
│  │  charging cost   │  │  air fryer       │  │  per project    │ │
│  │                  │  │                  │  │                 │ │
│  │  [Try it →]      │  │  [Try it →]      │  │  [Try it →]     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                  │
│  Built with public data from EIA.gov, EPA, and fueleconomy.gov  │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

### 모바일

```
┌──────────────────────────────┐
│  [Header]                    │
├──────────────────────────────┤
│                              │
│  Free Online                 │
│  Calculators & Tools         │
│                              │
│  Accurate, fast, and         │
│  beautifully simple.         │
│                              │
│  ┌──────────────────────┐   │
│  │  ⚡ EV Charging       │   │
│  │  Cost Calculator      │   │
│  │  Calculate your       │   │
│  │  monthly EV cost      │   │
│  │  [Try it →]           │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │  🍳 Air Fryer         │   │
│  │  Calculator           │   │
│  │  Convert oven recipes │   │
│  │  [Try it →]           │   │
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │  🖨️ 3D Printing       │   │
│  │  Cost Calculator      │   │
│  │  Estimate print costs │   │
│  │  [Try it →]           │   │
│  └──────────────────────┘   │
│                              │
├──────────────────────────────┤
│  [Footer]                    │
└──────────────────────────────┘
```

---

## EV Charging Cost Calculator

### 데스크톱 (2컬럼)

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                        │
├──────────────────────────────────────────────────────────────────┤
│  Home > EV Charging Cost Calculator                              │
│                                                                  │
│  EV Charging Cost Calculator                                     │
│  How much does it cost to charge your electric car?              │
│                                                                  │
│  ┌────────────────────────────┬──────────────────────────────┐  │
│  │  INPUT                     │  RESULT                       │  │
│  │                            │                               │  │
│  │  Region                    │  Monthly Charging Cost        │  │
│  │  [🇺🇸 US ▼] [California ▼] │                               │  │
│  │                            │  $47.20                       │  │
│  │  Vehicle                   │  ────────────                 │  │
│  │  [Tesla Model 3 LR    ▼]  │  Based on 1,000 mi/month     │  │
│  │                            │                               │  │
│  │  Battery: 75 kWh           │  ┌────────┐ ┌────────┐       │  │
│  │  Efficiency: 4.0 mi/kWh   │  │Annual  │ │5-Year  │       │  │
│  │                            │  │$566    │ │$2,832  │       │  │
│  │  Monthly Distance          │  └────────┘ └────────┘       │  │
│  │  ──●──────────── 1,000 mi  │                               │  │
│  │                            │  You save $1,240/year vs gas  │  │
│  │  Charging Mix              │                               │  │
│  │  Home L2:    ──●── 80%     │  [Share] [Save as PDF]        │  │
│  │  Public L2:  ●──── 10%     │                               │  │
│  │  DC Fast:    ●──── 10%     │                               │  │
│  │                            │                               │  │
│  │  [Mostly Home] [Mixed]     │                               │  │
│  │  [Mostly Public] [No Home] │                               │  │
│  └────────────────────────────┴──────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  EV vs Gas Cost Comparison                               │   │
│  │                                                          │   │
│  │  Monthly        Annual         5-Year                    │   │
│  │  ┌──┐ ┌──┐    ┌──┐ ┌──┐     ┌──┐ ┌──┐                 │   │
│  │  │EV│ │GA│    │EV│ │GA│     │EV│ │GA│                 │   │
│  │  │  │ │S │    │  │ │S │     │  │ │S │                 │   │
│  │  │  │ │  │    │  │ │  │     │  │ │  │                 │   │
│  │  │47│ │15│    │56│ │18│     │28│ │90│                 │   │
│  │  └──┘ │0 │    └──┘ │00│     └──┘ │00│                 │   │
│  │       └──┘         └──┘          └──┘                  │   │
│  │                                                          │   │
│  │  Tesla Model 3 LR saves $1,240/year vs BMW 3 Series     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  🌱 Environmental Impact                                 │   │
│  │                                                          │   │
│  │  Annual CO₂ Saved        Equivalent to                   │   │
│  │  4.2 tons                105 trees planted               │   │
│  │                                                          │   │
│  │  [Share on Twitter]  [Share on Facebook]                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Find EV Chargers Near You                               │   │
│  │                                                          │   │
│  │  📍 [Use My Location]  or  [Enter ZIP / City ________]   │   │
│  │  Radius: [10 mi] [25 mi] [50 mi]                        │   │
│  │                                                          │   │
│  │  [⚡ Level 2] [⚡⚡ DC Fast] [Tesla] [Free] [All]        │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │                                                  │   │   │
│  │  │              [OpenStreetMap]                      │   │   │
│  │  │                                                  │   │   │
│  │  │         📍  📍                                    │   │   │
│  │  │      📍        📍                                 │   │   │
│  │  │   📍     📍       📍                              │   │   │
│  │  │                                                  │   │   │
│  │  │              📍                                   │   │   │
│  │  │                                                  │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  │                                                          │   │
│  │  Nearby Stations (12 found)                              │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │ ChargePoint Station          0.3 mi  DC Fast     │   │   │
│  │  │ 123 Main St, San Jose        $0.32/kWh           │   │   │
│  │  ├──────────────────────────────────────────────────┤   │   │
│  │  │ Tesla Supercharger           0.8 mi  DC Fast     │   │   │
│  │  │ 456 Oak Ave, San Jose        $0.28/kWh           │   │   │
│  │  ├──────────────────────────────────────────────────┤   │   │
│  │  │ EVgo Station                 1.2 mi  DC Fast     │   │   │
│  │  │ 789 Elm Blvd, Santa Clara    $0.35/kWh           │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Understanding EV Charging Costs                         │   │
│  │                                                          │   │
│  │  (800자+ 가이드 텍스트)                                    │   │
│  │  ...                                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Frequently Asked Questions                              │   │
│  │                                                          │   │
│  │  ▶ How much does it cost to charge a Tesla at home?      │   │
│  │  ▶ Is it cheaper to charge at home or public station?    │   │
│  │  ▶ How much electricity does an EV use per month?        │   │
│  │  ▶ What is the average cost per kWh in the US?           │   │
│  │  ▶ How do EV charging costs compare to gas?              │   │
│  │  ▶ Where are the nearest EV charging stations?           │   │
│  │  ▶ How much does it cost to use a public EV charger?     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Related Tools                                           │   │
│  │  [Air Fryer Calculator] [3D Printing Calculator]         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

### 모바일 (단일 컬럼)

```
┌──────────────────────────────┐
│  [Header]                    │
├──────────────────────────────┤
│  Home > EV Charging...       │
│                              │
│  EV Charging Cost            │
│  Calculator                  │
│                              │
│  ┌──────────────────────┐   │
│  │  Region               │   │
│  │  [🇺🇸 US ▼]            │   │
│  │  [California ▼]       │   │
│  │                       │   │
│  │  Vehicle              │   │
│  │  [Tesla Model 3 LR ▼]│   │
│  │                       │   │
│  │  Monthly Distance     │   │
│  │  ──●──── 1,000 mi     │   │
│  │                       │   │
│  │  Charging Mix         │   │
│  │  [Mostly Home ▼]      │   │  ← 모바일에서는 프리셋 드롭다운
│  └──────────────────────┘   │
│                              │
│  ┌──────────────────────┐   │
│  │  Monthly Cost         │   │
│  │                       │   │
│  │  $47.20               │   │
│  │                       │   │
│  │  Annual: $566         │   │
│  │  5-Year: $2,832       │   │
│  │  Save: $1,240/yr      │   │
│  └──────────────────────┘   │
│                              │
│  [EV vs Gas Chart]           │
│  [CO₂ Impact Card]           │
│                              │
│  ┌──────────────────────┐   │
│  │  Find Chargers        │   │
│  │  [Use My Location]    │   │
│  │  [Map / List toggle]  │   │
│  │                       │   │
│  │  [Map View]           │   │
│  │  or                   │   │
│  │  [List View]          │   │
│  └──────────────────────┘   │
│                              │
│  [Guide Text]                │
│  [FAQ]                       │
│  [Related Tools]             │
│                              │
├──────────────────────────────┤
│  [Footer]                    │
└──────────────────────────────┘
```

---

## 다크모드 비교

### 라이트 모드 카드

```
┌─────────────────────────────┐
│  bg: #FFFFFF                │
│  border: #E2E8F0            │
│  shadow: sm                 │
│                             │
│  Monthly Cost               │  text: #1A1A2E
│  $47.20                     │  gradient: blue → emerald
│  Based on 1,000 mi/month   │  text: #64748B
│                             │
│  Save $1,240/year           │  text: #10B981
└─────────────────────────────┘
```

### 다크 모드 카드

```
┌─────────────────────────────┐
│  bg: #1E293B                │
│  border: #334155            │
│  shadow: none               │
│                             │
│  Monthly Cost               │  text: #F1F5F9
│  $47.20                     │  gradient: bright blue → light emerald
│  Based on 1,000 mi/month   │  text: #94A3B8
│                             │
│  Save $1,240/year           │  text: #34D399
└─────────────────────────────┘
```

---

## 필수 페이지 레이아웃

### About / Privacy / Terms (공통)

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    About utilverse                               │
│                                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │                                          │                   │
│  │  (prose 스타일 본문)                       │                   │
│  │  max-w-3xl, 중앙 정렬                     │                   │
│  │  leading-relaxed                         │                   │
│  │                                          │                   │
│  │  ...                                     │                   │
│  │                                          │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```

### Contact

```
┌──────────────────────────────────────────────────────────────────┐
│  [Header]                                                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                    Contact Us                                    │
│                                                                  │
│  ┌──────────────────────────────────────────┐                   │
│  │                                          │                   │
│  │  Name     [________________________]     │                   │
│  │  Email    [________________________]     │                   │
│  │  Subject  [________________________]     │                   │
│  │  Message  [________________________]     │                   │
│  │           [________________________]     │                   │
│  │           [________________________]     │                   │
│  │                                          │                   │
│  │           [Send Message]                 │                   │
│  │                                          │                   │
│  │  We typically respond within 48 hours.   │                   │
│  │                                          │                   │
│  └──────────────────────────────────────────┘                   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  [Footer]                                                        │
└──────────────────────────────────────────────────────────────────┘
```
