# 버그 & 해결책 기록

## 작성 규칙
- 발생한 버그와 해결책을 누적 기록
- 재발 방지책까지 반드시 작성
- 유사 에러 발생 시 이 파일 먼저 검색

## 버그 템플릿
```
### BUG-[번호]: [버그 제목]
- 날짜: YYYY-MM-DD
- 상태: 해결 | 진행중 | 보류
- 증상: 어떤 문제가 발생했는가 (에러 메시지 포함)
- 원인: 왜 발생했는가
- 해결책: 어떻게 해결했는가 (코드 포함)
- 재발 방지: 앞으로 어떻게 방지할 것인가
```

---

## 예상 주의사항 (참고용)

### BUG-REF-001: Leaflet SSR 오류
- 상태: 참고용
- 증상: `ReferenceError: window is not defined` (Leaflet이 서버에서 실행될 때)
- 원인: Leaflet.js는 브라우저 window 객체에 의존
- 해결책:
  ```typescript
  // next/dynamic으로 SSR 비활성화
  const Map = dynamic(() => import('@/components/ev/charger-finder-map'), {
    ssr: false,
    loading: () => <MapSkeleton />
  })
  ```
- 재발 방지: 브라우저 전용 라이브러리는 항상 dynamic import + ssr: false

### BUG-REF-002: Hydration Mismatch (다크모드)
- 상태: 참고용
- 증상: `Hydration failed because the initial UI does not match`
- 원인: 서버에서는 테마를 모르고, 클라이언트에서 localStorage 읽어서 적용할 때 불일치
- 해결책:
  ```typescript
  // next-themes의 ThemeProvider에 attribute="class" 설정
  // suppressHydrationWarning을 html 태그에 추가
  <html lang="en" suppressHydrationWarning>
  ```
- 재발 방지: next-themes 공식 가이드 따르기

### BUG-REF-003: Recharts 반응형 깨짐
- 상태: 참고용
- 증상: 차트가 컨테이너 너비를 초과하거나 0px로 렌더링
- 원인: ResponsiveContainer에 부모 요소의 명시적 너비/높이가 없을 때
- 해결책:
  ```tsx
  // 부모에 명시적 크기 지정
  <div className="w-full h-[300px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>...</BarChart>
    </ResponsiveContainer>
  </div>
  ```
- 재발 방지: ResponsiveContainer 사용 시 항상 부모 크기 명시

---
<!-- 실제 프로젝트 버그는 이 아래에 추가 -->
