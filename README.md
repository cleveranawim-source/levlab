# Lev Lab (레브랩) — 마음을 읽는 교육

서울 사회정서교육에 맞춘 중학교 SEL 수업과 웹앱을 만드는 레브랩의 공식 웹사이트입니다.

- 운영 주소: https://www.levlab.co.kr (levlab.co.kr 은 www 로 이동)
- 배포: Vercel (GitHub `main` 푸시 시 자동 배포)

## 기술 스택

- React 18 + Vite 5, React Router 6 (SPA, `vercel.json` 에서 모든 경로를 `index.html` 로)
- 디자인 시스템: `src/styles/theme.css` (색·글꼴 토큰, 공통 컴포넌트 스타일)
- 콘텐츠 페이지 스타일: `src/styles/content.css`
- 글꼴: Pretendard (CDN)

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # dist/ 생성
npm run preview  # 빌드 결과 미리보기
```

Node 18 이상이 필요합니다.

## 구조

```
src/
├── App.jsx              라우터, 경로별 제목·설명, 404
├── main.jsx             진입점, 스타일 불러오기
├── data/
│   ├── site.js          메뉴, 연락처, 도메인, 커리큘럼 규모(차시 수)
│   ├── sel.js           서울 사회정서교육 4영역 · 17개 사회정서기술
│   ├── curriculum.js    중학교 성취기준 17개 원문, 학년별 학습 주제
│   └── tools.js         SEL 콘텐츠(웹앱·게임) 목록
├── pages/               홈, 소개, SEL 수업, SEL 콘텐츠, 문의, 개인정보 처리방침, 404 등
├── components/          Nav, Footer, PageShell, ToolsGallery, SelExplorer, VideoShowcase …
├── lib/                 공통 훅(테마, 화면 크기, 모션 설정, 페이지 메타)
└── styles/              theme.css, content.css
public/
├── img/, video/, logo/  이미지·영상·로고
├── robots.txt, sitemap.xml
└── gangdannote/         강단노트 앱 지원·개인정보 페이지 (별도 제품, 주소 유지)
(내부 점검 자료는 저장소에 올리지 않고 드라이브에 보관)
```

## 자주 하는 일

### SEL 콘텐츠(웹앱) 추가

`src/data/tools.js` 의 `TOOLS` 에 항목을 더합니다.

| 필드 | 뜻 |
|---|---|
| `n`, `d` | 이름, 한두 문장 설명 (학생이 무엇을 해 보는지) |
| `t` | 유형: `게임` · `자기 점검` · `활동 도구` |
| `dom` | 영역: `자기` · `대인관계` · `공동체` · `마음건강` · `전체` |
| `aud` | 대상: `학생` · `교사` |
| `standards` | 성취기준 코드 뒷자리 배열, 예 `["02-01"]` = [9사회정서02-01] |
| `privacy` | 교사가 알아야 할 데이터 처리 한 줄 (카메라, 서버 전송 여부) |
| `url` | 실행 주소. 빈 문자열이면 "곧 공개" |

실시간 데이터베이스를 쓰는 앱은 반별 격리·기한 만료·교사 권한을 확인한 뒤 올립니다.

### 페이지 추가

1. `src/pages/새페이지.jsx` 를 만들고 `PageShell` 로 감쌉니다.
2. `src/App.jsx` 에 경로를 등록하고, 페이지 제목·설명을 메타 목록에 더합니다.
3. 메뉴에 보이려면 `src/data/site.js` 의 `NAV_ITEMS` 에 더합니다.
4. `public/sitemap.xml` 에 주소를 더합니다.

## 문구 원칙

- 공식 명칭은 **서울 사회정서교육** (서울특별시교육청). 성취기준 코드는 원문 그대로 씁니다. [9사회정서02-01]은 공감, [9사회정서02-02]는 관점입니다.
- 경력 연수("○○년") 표현은 쓰지 않습니다.
- 실제로 받을 수 있는 자료·글만 링크합니다. 준비 중인 것은 준비 중이라고 씁니다.
- 공개 콘텐츠는 특정 종교를 전제하지 않습니다.

## 라이선스

&copy; 2026 Lev Lab. All rights reserved. 공개 수업 자료의 이용 조건은 공개 시 따로 안내합니다.
