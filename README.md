# CSP Lab · 암호 및 보안 프로토콜 연구실

전남대학교 인공지능학부 연구실 홈페이지입니다. GitHub Pages로 공개하고, Pages CMS의 한국어 폼에서 내용을 편집하도록 구성했습니다.

## 화면 구성

- Home: 연구실 소개, 연구 분야, 교수 소개, 학생 모집 안내
- Professor: 교수 소개, 사진, 학력·경력, Scholar·CV 링크
- Research: 연구 분야와 사진·상세 설명
- Publications: 연도별 논문, 제목·저자·학술지 검색, 연도·유형 필터, DOI·PDF·코드 링크
- People / Alumni: 구성원 소개 및 졸업생 이력
- 사이트 관리: Pages CMS로 연결하는 첫 사용 안내

논문·구성원·졸업생의 실제 자료는 아직 제공되지 않아 빈 목록으로 두었습니다. 교수 사진·학력·경력도 확인되지 않은 내용을 넣지 않았습니다. 영문 연구실 이름은 국문 명칭을 옮긴 초안이며, 정식 표기를 확인한 뒤 관리 화면에서 수정할 수 있습니다.

## 처음 공개하기

1. 완성된 변경을 `main`에 반영합니다.
2. 저장소 **Settings → Pages → Source → GitHub Actions**를 선택합니다.
3. **Actions → Build and publish website → Run workflow**를 실행합니다.
4. 성공하면 Pages 설정 또는 작업 결과에 나온 주소로 접속합니다. 기본 예상 주소는 `https://jnu-csplab.github.io/labwebsite/`입니다.

현재 저장소는 비공개입니다. GitHub Free는 공개 저장소의 Pages를 지원하며, 비공개 저장소는 해당 기능을 제공하는 유료 요금제가 필요합니다. 저장소를 공개로 바꾸는 결정은 소유자가 해야 합니다. 비공개 저장소로 배포하더라도 일반적인 GitHub Pages 웹사이트는 공개됩니다. 실제 배포 성공 전까지 위 주소가 작동한다고 가정하지 마세요.

## 코딩 없이 수정하기

[Pages CMS](https://app.pagescms.org/)에 GitHub로 로그인하고 **labwebsite 한 저장소만** 연결합니다. `main`을 선택하면 `.pages.yml`에 설정된 한국어 편집 항목이 나타납니다. 저장하면 GitHub Actions가 다시 홈페이지를 만듭니다.

- **연구 논문:** 항목 추가 → 제목·저자·발행 연도·학술지/학회·구분 입력 → 저장
- **구성원·졸업생:** 항목 추가 또는 기존 인물 선택 → 사진·소개 수정 → 저장
- **졸업 처리:** 재실 및 졸업 구분을 ‘졸업생’으로 변경 → 졸업 연도·진로 입력 → 저장
- **연구실 기본 정보 / 교수 소개 / 연구 분야:** 텍스트와 사진 변경 → 저장

자세한 절차는 [편집 안내](docs/EDITOR_GUIDE.ko.md)를 참고하세요. `/admin/`은 직접 만든 로그인 서버가 아니라 안전한 외부 편집 도구로 연결하는 안내 화면입니다. 관리 권한은 GitHub와 Pages CMS가 처리합니다. CMS 최초 연결·실제 저장·공개 배포는 계정 소유자의 초기 설정 후 확인해야 합니다.

## 개발 및 확인

Node.js 22 이상이 필요합니다. 외부 패키지 설치는 없습니다.

```sh
node --test tests/*.test.mjs
node scripts/build.mjs
python -m http.server 8765 --directory dist
```

`http://localhost:8765`에서 확인합니다. 정적 생성 결과는 `dist/`입니다. 화면 이동에는 해시 주소를 사용하므로 GitHub Pages의 저장소 하위 경로 및 새로고침에서도 작동합니다. 빌드 시 CMS 데이터 형식을 검증하고 텍스트·링크를 정리합니다. 배포 산출물에는 웹 화면·스타일·동작과 공개 미디어만 포함합니다. 저장소에 비밀번호나 비공개 개인정보를 넣지 마세요.

GitHub Actions는 변경 제안에서 검증·빌드만 수행하며, `main`에서만 배포합니다. 업로드한 사진과 PDF는 홈페이지에 공개되는 자료입니다. JSON 목록을 여러 사람이 동시에 편집할 때에는 저장 시점이 겹치지 않도록 순서를 정하는 것이 좋습니다.

## 내용 출처

- [전남대학교 인공지능학부 교수 소개](https://aisw.jnu.ac.kr/aisw/510/subview.do): 교수명·소속·연구실·연락처·전공
- [2026년 9월 연구실 모집 공고](https://aisw.jnu.ac.kr/aisw/518/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGYWlzdyUyRjY0JTJGMTA1NDI3OCUyRmFydGNsVmlldy5kbyUzRg%3D%3D): 주요 연구 분야 및 모집 안내
- [GitHub Pages 설명](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Pages CMS 시작하기](https://pagescms.org/docs/quick-start/)

구성 참고: [서울대 AISys Lab](https://aisys.snu.ac.kr/), [KAIST HCI Lab](https://hcil.kaist.ac.kr/), [한양대 암생물학연구실](https://www.cancerbio.hanyang.ac.kr/). 디자인과 문구는 이 연구실용으로 작성했으며 다른 사이트의 템플릿이나 사진을 복사하지 않았습니다.
