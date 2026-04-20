# 부산 드라마 스팟 & 스타일 — 프로젝트 규칙

> AI 에이전트(Antigravity/Cursor/Copilot)와 팀원이 공통으로 따라야 할 규칙입니다.
> 변경 시 PR 리뷰를 받아주세요.

---

## 1. 기술 스택
### 프로젝트 기술 스택을 정했습니다.

### 프로젝트 기술 스택

- **Frontend**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase

### 주요 라이브러리

| 분류 | 라이브러리 |
|------|-----------|
| 라우팅 | Next.js App Router (`app/` 디렉토리) |
| 상태 관리 | Zustand + persist 미들웨어 |
| i18n | react-i18next |
| UI 컴포넌트 | Radix UI + shadcn/ui |
| 알림 (Toast) | Sonner |
| 폼 | react-hook-form + zod |
| DB / Auth / Storage | Supabase |

### ❌ 절대 추가 금지

- `react-router-dom` — Next.js App Router 사용
- `pages/` 디렉토리 방식 — `app/` 전용 프로젝트
- `any` 타입 남용 — 명시적 TypeScript 타입 필수
- 임의 CSS 작성 — Tailwind 디자인 토큰 준수

---

## 2. 코드 작성 규칙

### 디렉토리 구조

```
app/                        # Next.js App Router 라우트
├── spots/
│   ├── page.tsx            # /spots
│   └── [id]/
│       └── page.tsx        # /spots/:id
├── style-test/
│   └── page.tsx
├── my-course/
│   └── page.tsx
├── layout.tsx              # 루트 레이아웃
└── globals.css

src/
├── components/             # 재사용 가능한 UI 컴포넌트
│   └── ui/                 # shadcn/ui 생성 파일 (직접 수정 금지)
├── data/                   # 정적 JSON 원본
├── hooks/                  # 커스텀 훅
├── lib/
│   └── supabase/           # Supabase 클라이언트 및 repository 함수
├── locales/                # i18n 번역 파일 (ko/en/ja/zh-TW/zh-CN)
├── stores/                 # Zustand 스토어
└── types/                  # 공통 TypeScript 타입
```

### 컴포넌트 원칙

- **하나의 파일에 모든 로직 금지** — 100줄 초과 시 분리 검토
- 함수당 최대 **20줄** 권장
- Props 타입은 파일 상단에 `interface` 로 명시
- 매직 스트링/넘버는 상수로 추출

### i18n 규칙

- 지원 언어: `ko` / `en` / `ja` / `zh-TW` / `zh-CN` (5개)
- 새 텍스트 추가 시 **5개 locale 파일 모두** 업데이트
- 키 형식: `섹션.서브섹션.키` (예: `detail.similar.title`)
- 반드시 `react-i18next` 의 `useTranslation` 사용

### Supabase 규칙

- DB 접근은 `src/lib/supabase/` 에 repository 함수로 분리
- 클라이언트 컴포넌트: `createBrowserClient()`
- 서버 컴포넌트 / Route Handler: `createServerClient()`
- RLS(Row Level Security) 필수 활성화

---

## 3. 개발 프로세스

### 브랜치 전략

```
main                     ← 배포 브랜치 (직접 push 금지)
feature/spot-detail      ← 현재 작업 중
feat/r3-spot-detail      ← R3 완료 브랜치
```

### 커밋 메시지 형식

```
feat: SpotDetail 드라마 씬 멀티갤러리 추가
fix: spots 페이지 레이아웃 버그 수정
chore: i18n 번역 키 5개 언어 추가
refactor: NearbyList 컴포넌트 분리
```

### 현재 구현 상태

| 릴리즈 | 페이지 | 상태 |
|--------|--------|------|
| R1 | 랜딩 `/` + 언어 선택 | ✅ 완료 |
| R2 | 촬영지 목록 `/spots` + 스타일 퀴즈 + 내 코스 | ✅ 완료 |
| R3 | 스팟 상세 `/spots/:id` | ✅ 완료 |
| R4 | — | 🔜 미정 |
