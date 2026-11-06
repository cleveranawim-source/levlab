# Lev Lab (레브랩) — 마음을 읽는 교육

서울 사회정서교육에 맞춘 중학교 SEL 수업과 웹앱을 만드는 레브랩의 공식 웹사이트입니다.

- 운영 주소: https://www.levlab.co.kr (levlab.co.kr 은 www 로 이동)
- 배포: Vercel (GitHub `main` 푸시 시 자동 배포)

## 기술 스택

- Next.js 16 App Router + React 19 (JavaScript, 모든 공개 페이지 빌드 시 정적 생성)
- 디자인 시스템: `styles/theme.css` (색·글꼴 토큰, 공통 컴포넌트 스타일)
- 콘텐츠 페이지 스타일: `styles/content.css`
- 글꼴: Pretendard 1.3.9 자체 호스팅 (가변 동적 서브셋, `next/font/local`로 공통 글자만 미리 로드)

## 실행

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # .next/ 생성
npm run start    # 프로덕션 빌드 미리보기
npm run check    # 빌드 + 데이터 검증 + 정적 생성·메타데이터·HTTP 상태 검사
```

Node 20.9 이상이 필요합니다.

## 구조

```
app/                    레이아웃·라우트·서버 메타데이터·404·sitemap·robots
components/             Nav, Footer, PageShell, ToolsGallery, SelExplorer, VideoShowcase …
page-content/           기존 페이지 본문 (상호작용이 필요한 화면은 Client Component)
lib/                    공통 훅·페이지 메타데이터
styles/                 theme.css, content.css (루트 레이아웃에서 한 번 불러오기)
data/                   site.js, sel.js, curriculum.js, tools.js
content/                standards.json, lessons.json
features/curriculum/    커리큘럼 데이터 로더·학년·성취기준·차시 화면
scripts/check.mjs       콘텐츠 필드·참조 검증 및 임시 next start 서버 HTTP 검사
public/
├── img/, video/, logo/  이미지·영상·로고
└── gangdannote/         강단노트 앱 지원·개인정보 HTML (슬래시 유무 모두 200)
(내부 점검 자료는 저장소에 올리지 않고 드라이브에 보관)
```

## 자주 하는 일

### SEL 콘텐츠(웹앱) 추가

`data/tools.js` 의 `TOOLS` 에 항목을 더합니다.

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

1. `page-content/새페이지.jsx`를 만들고 `PageShell`로 본문을 감쌉니다. Nav·Footer·main은 루트 레이아웃과 template이 제공합니다.
2. `app/경로/page.jsx`에서 본문을 렌더링하고 `metadata`를 내보냅니다. 기존 정적 페이지는 `lib/pageMeta.js`의 `PAGE_META`에 제목·설명을 등록합니다.
3. 메뉴에 보이려면 `data/site.js`의 `NAV_ITEMS`에 더합니다.
4. `app/sitemap.js`에 주소를 반영하고 `npm run check`를 실행합니다. 차시는 `content/lessons.json`에서 `status`가 `published`인 것만 sitemap에 포함하며, 초안은 `noindex, nofollow`로 정적 생성합니다.

### Vercel 설정

`vercel.json`이 프레임워크(`nextjs`), 빌드(`npm run build`), 설치(`npm ci`), 출력(`.next`)을 지정하여 기존 Vite 설정을 대체합니다. SPA 전체 재작성은 제거했습니다. 일반적인 설정에서는 대시보드 변경이 필요하지 않으며, 프로젝트가 Node 20.9 미만으로 고정되어 있거나 Root Directory가 이 저장소 루트와 다를 때만 소유자가 이를 수정해야 합니다. 실제 배포는 별도로 수행합니다.

## 문구 원칙

- 공식 명칭은 **서울 사회정서교육** (서울특별시교육청). 성취기준 코드는 원문 그대로 씁니다. [9사회정서02-01]은 공감, [9사회정서02-02]는 관점입니다.
- 경력 연수("○○년") 표현은 쓰지 않습니다.
- 실제로 받을 수 있는 자료·글만 링크합니다. 준비 중인 것은 준비 중이라고 씁니다.
- 공개 콘텐츠는 특정 종교를 전제하지 않습니다.

## 라이선스

&copy; 2026 Lev Lab. All rights reserved. 공개 수업 자료의 이용 조건은 공개 시 따로 안내합니다.
