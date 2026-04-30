# Lev Lab (레브랩) — 마음을 읽는 교육

SEL(사회정서학습) 교육 콘텐츠 연구소 레브랩의 공식 웹사이트입니다.

## 기술 스택

- **React 18** + **Vite 5** — 빠른 HMR 개발 환경
- **React Router v6** — SPA 라우팅
- **Pretendard** — 한국어 최적화 가변 웹폰트
- 별도 CSS 프레임워크 없이 인라인 스타일 + 공통 토큰 기반

## 시작하기

### 필수 조건

- **Node.js 18+** (권장: 20 LTS)
- **npm 9+**

Node.js 설치 확인:
```bash
node -v   # v18.0.0 이상
npm -v    # 9.0.0 이상
```

### 설치 및 실행

```bash
# 1. 압축 해제
unzip levlab-project.zip -d levlab
cd levlab

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 됩니다.
(자동으로 브라우저가 열리지 않으면 주소를 직접 입력하세요)

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 트러블슈팅

**화면이 안 뜰 때:**
1. 터미널에서 에러 메시지 확인
2. `node_modules` 삭제 후 재설치: `rm -rf node_modules && npm install`
3. 포트 충돌 시 다른 포트가 자동 할당됩니다 (터미널 출력 확인)

**Windows에서 실행 시:**
- PowerShell 또는 CMD에서 실행
- `rm -rf` 대신 `rmdir /s /q node_modules` 사용

**npm install 에러:**
- Node.js 18 이상인지 확인: `node -v`
- npm 캐시 초기화: `npm cache clean --force`

## 프로젝트 구조

```
src/
├── main.jsx                    # React 진입점
├── App.jsx                     # 라우터 설정
├── index.css                   # 글로벌 리셋 + 기본 스타일
│
├── styles/
│   └── tokens.js               # 디자인 토큰 (COLORS, SEL_DOMAINS, NAV_ITEMS)
│
├── hooks.js                    # 공통 훅 (useInView, useScrolled)
│
├── components/
│   ├── ui.jsx                  # UI 프리미티브 (FadeIn, Hover, Card, Pill 등)
│   ├── Nav.jsx                 # 글로벌 네비게이션
│   ├── Footer.jsx              # 글로벌 푸터
│   └── ScrollToTop.jsx         # 페이지 전환 시 스크롤 리셋
│
└── pages/
    ├── HomePage.jsx            # 홈 (8개 섹션)
    └── AboutPage.jsx           # 소개 (7개 섹션)
```

## 페이지 추가 방법

1. `src/pages/NewPage.jsx` 생성
2. 공통 컴포넌트 import:
   ```jsx
   import Nav from "../components/Nav";
   import Footer from "../components/Footer";
   import { FadeIn, SectionLabel, SectionTitle } from "../components/ui";
   import { COLORS } from "../styles/tokens";
   ```
3. `src/App.jsx`에 라우트 추가:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```
4. `src/styles/tokens.js`의 `NAV_ITEMS`에 메뉴 항목 추가

## 디자인 시스템

### 컬러

| 용도 | 토큰 | 비고 |
|------|------|------|
| 프라이머리 | `teal50`~`teal900` | 브랜드 메인 컬러 |
| 자기 영역 | `purple50`~`purple800` | SEL 자기이해 |
| 대인관계 | `coral50`~`coral800` | SEL 공감·소통 |
| 마음건강 | `blue50`~`blue800` | SEL 회복탄력성 |
| 중립 | `gray50`~`gray800` | 텍스트·배경 |

### 공통 컴포넌트

| 컴포넌트 | 설명 |
|----------|------|
| `<FadeIn delay={0.1}>` | 스크롤 진입 시 fade-up 애니메이션 |
| `<Hover style={} hoverStyle={}>` | 호버 시 스타일 전환 |
| `<Card>` | 호버 리프트 카드 |
| `<Pill bg={} color={}>` | 태그/뱃지 |
| `<SectionLabel>` | 영문 섹션 라벨 |
| `<SectionTitle>` | 섹션 제목 (h2) |

## 배포 (Vercel)

### 방법 1: 웹 UI (추천)

1. [github.com](https://github.com)에서 새 저장소 만들기 (예: `levlab`)
2. 프로젝트 폴더에서:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/[내계정]/levlab.git
   git push -u origin main
   ```
3. [vercel.com](https://vercel.com)에 GitHub 계정으로 로그인
4. "Add New Project" → GitHub 저장소 선택 → "Deploy" 클릭
5. 끝! `levlab-[계정].vercel.app` 주소가 생성됩니다

### 방법 2: CLI

```bash
npm i -g vercel
vercel
```

### 커스텀 도메인

Vercel 대시보드 → Settings → Domains에서 `levlab.kr` 등 연결 가능.
`vercel.json`에 SPA 라우팅 설정이 포함되어 있어서 `/about`, `/programs` 등 직접 접속이 정상 동작합니다.

## 라이선스

&copy; 2026 Lev Lab. All rights reserved.
