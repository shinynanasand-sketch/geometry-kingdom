# 🎓 초등학생용 기하학 AR 학습 웹앱

> **도형 친구들과 함께하는 신나는 수학 모험!**

초등학생들이 AR(증강현실) 기술을 활용하여 기하학을 재미있게 학습할 수 있는 웹 애플리케이션입니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![A-Frame](https://img.shields.io/badge/A--Frame-EF2D5E?logo=aframe&logoColor=white)](https://aframe.io/)

---

## 📖 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [설치 방법](#-설치-방법)
- [사용 방법](#-사용-방법)
- [프로젝트 구조](#-프로젝트-구조)
- [레벨 소개](#-레벨-소개)
- [캐릭터 소개](#-캐릭터-소개)
- [스크린샷](#-스크린샷)
- [개발 로드맵](#-개발-로드맵)
- [기여 방법](#-기여-방법)
- [라이선스](#-라이선스)
- [문의](#-문의)

---

## 🎯 프로젝트 소개

이 프로젝트는 초등학생들이 **AR 기술**을 통해 **기하학**을 체험하며 학습할 수 있도록 설계된 교육용 웹 애플리케이션입니다.

### 🌟 특징

- 📱 **모바일 우선 설계**: 스마트폰과 태블릿에서 최적화
- 🎮 **게임 기반 학습**: 재미있는 게임 요소로 학습 동기 부여
- 🇰🇷 **한국 문화 융합**: 통일신라시대 주령구(국보 제74호) 콘텐츠
- 📚 **교육과정 반영**: 한국 초등 수학 교육과정 100% 반영
- 🎨 **귀여운 캐릭터**: 9명의 도형 친구들과 함께하는 모험
- 🏆 **게이미피케이션**: 수집, 보상, 랭킹 시스템

### 🎓 교육적 가치

- **STEAM 교육**: 과학, 기술, 공학, 예술, 수학의 통합
- **공간 지각 능력** 향상
- **자기주도 학습** 능력 개발
- **한국 문화** 자긍심 고취

---

## ✨ 주요 기능

### 1. 📐 AR 학습 모드
- **마커 기반 AR**: 인쇄 가능한 마커로 안정적인 AR 체험
- **마커리스 AR**: 마커 없이 평면 감지로 자유로운 배치
- **3D 도형 관찰**: 360도 회전하며 도형 탐구
- **인터랙티브 학습**: 터치로 도형 조작

### 2. 🎮 7개 레벨
- **레벨 1**: 평면 도형 기초 (삼각형, 사각형, 원)
- **레벨 2**: 평면 도형 심화 (각도, 대칭)
- **레벨 3**: 입체 도형 기초 (정육면체, 구, 원기둥)
- **레벨 4**: 입체 도형 심화 (전개도, 각기둥, 각뿔)
- **레벨 5**: 넓이와 부피 계산
- **레벨 6**: 종합 챌린지
- **레벨 7**: 주령구 도형 공방 (특별 레벨)

### 3. 🎲 주령구 특별 콘텐츠
- **역사 학습**: 통일신라시대 주령구 이야기
- **14면체 구조**: 깎은 정육면체 탐구
- **주령구 게임**: 3가지 보드게임
- **AR 체험**: 주령구 굴리기

### 4. 🎯 게이미피케이션
- **도형 카드**: 50장 수집 (일반/레어/에픽/전설)
- **배지**: 20개 획득 가능
- **코인 & 경험치**: 레벨업 시스템 (최대 Lv.50)
- **아이템 상점**: 힌트, 스킨, 효과 구매
- **랭킹**: 일일/주간/전체 순위

### 5. 🎪 미니게임 (6종)
- 도형 사냥 🎯
- 도형 매칭 🎴
- 도형 퍼즐 🧩
- 도형 쌓기 🏗️
- 도형 레이싱 🏁
- 도형 공장 🏭

### 6. 🔬 도형 창작 시스템
- **자유 창작**: 나만의 입체 도형 만들기
- **오일러 공식**: V - E + F = 2 검증
- **과학적 설명**: 왜 정다면체는 5개뿐인가?
- **불가능한 도형**: 만들 수 없는 이유 학습

---

## 🛠️ 기술 스택

### Frontend
- **HTML5**: 웹 페이지 구조
- **CSS3**: 스타일링 및 반응형 디자인
- **Vanilla JavaScript**: 애플리케이션 로직

### AR/3D
- **A-Frame 1.4.0**: 3D/VR 프레임워크
- **AR.js**: WebAR 라이브러리

### 데이터 저장
- **LocalStorage**: 진행도, 코인, 배지 저장

---

## 📥 설치 방법

### 1. 저장소 클론

```bash
git clone https://github.com/nanasand/math-ar-learning.git
cd math-ar-learning
```

### 2. 로컬 서버 실행

#### Python 사용 (권장)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Node.js 사용
```bash
# http-server 설치
npm install -g http-server

# 서버 실행
http-server -p 8000
```

#### VS Code Live Server 사용
1. VS Code에서 프로젝트 열기
2. Live Server 확장 프로그램 설치
3. `index.html` 우클릭 → "Open with Live Server"

### 3. 브라우저에서 열기

```
http://localhost:8000
```

---

## 🎮 사용 방법

### 1. 메인 화면
- 캐릭터 선택
- 레벨 선택 (모든 레벨 처음부터 선택 가능)
- 일일 미션 확인

### 2. AR 모드 선택
- **마커 기반 AR**: 마커 다운로드 → 인쇄 → 카메라로 스캔
- **마커리스 AR**: 카메라 권한 허용 → 평면에 도형 배치

### 3. 퀴즈 풀기
- 문제 읽기
- AR로 도형 관찰
- 정답 선택
- 힌트 사용 가능

### 4. 미니게임
- 메인 화면에서 "미니게임" 선택
- 원하는 게임 선택
- 게임 플레이

### 5. 주령구 체험
- 레벨 7 선택
- 주령구 역사 학습
- 주령구 만들기
- 주령구 게임 플레이

---

## 📁 프로젝트 구조

```
math/
├── index.html              # 메인 페이지
├── ar-marker.html         # 마커 기반 AR
├── ar-markerless.html     # 마커리스 AR
├── quiz.html              # 퀴즈 페이지
├── minigames.html         # 미니게임
├── juryeonggu.html        # 주령구 페이지
│
├── css/                   # 스타일시트
│   ├── style.css
│   ├── responsive.css
│   └── ...
│
├── js/                    # JavaScript 파일
│   ├── app.js
│   ├── ar-marker.js
│   ├── quiz-system.js
│   └── ...
│
├── assets/                # 리소스
│   ├── markers/          # AR 마커
│   ├── images/           # 이미지
│   ├── sounds/           # 사운드
│   └── models/           # 3D 모델
│
├── data/                  # 데이터 파일
│   ├── levels.json
│   ├── quiz-questions.json
│   └── ...
│
├── docs/                  # 문서
│   ├── PROJECT_PLAN.md
│   └── ...
│
└── README.md             # 이 파일
```

---

## 🎮 레벨 소개

### 레벨 1: 평면 도형 기초 ⭐
**대상**: 1-2학년  
**학습 내용**: 삼각형, 사각형, 원 인식  
**퀴즈**: 10문제

### 레벨 2: 평면 도형 심화 ⭐⭐
**대상**: 3-4학년  
**학습 내용**: 각도, 대칭, 사각형의 종류  
**퀴즈**: 15문제

### 레벨 3: 입체 도형 기초 ⭐⭐
**대상**: 3-4학년  
**학습 내용**: 정육면체, 구, 원기둥  
**퀴즈**: 15문제

### 레벨 4: 입체 도형 심화 ⭐⭐⭐
**대상**: 5-6학년  
**학습 내용**: 전개도, 각기둥, 각뿔  
**퀴즈**: 20문제

### 레벨 5: 넓이와 부피 ⭐⭐⭐
**대상**: 5-6학년  
**학습 내용**: 넓이 공식, 부피 공식  
**퀴즈**: 20문제

### 레벨 6: 종합 챌린지 ⭐⭐⭐⭐
**대상**: 전체  
**학습 내용**: 모든 개념 종합  
**퀴즈**: 30문제 (시간 제한)

### 레벨 7: 주령구 도형 공방 🎲⭐⭐⭐⭐⭐
**대상**: 전체  
**학습 내용**: 14면체, 한국 전통 문화  
**활동**: 주령구 만들기, 보드게임

---

## 👥 캐릭터 소개

### 메인 캐릭터

#### 삼이 (Sam) 🔺
활발하고 호기심 많은 삼각형 친구

#### 네모 (Nemo) 🟦
똑똑하고 논리적인 사각형 친구

#### 동글이 (Dongle) ⭕
친절하고 따뜻한 원 친구

#### 큐브 (Cube) 🎲
쿨하고 자신감 넘치는 정육면체 친구

#### 스피어 (Sphere) 🌐
신비롭고 지혜로운 구 친구

### 특별 캐릭터

#### 헷갈이 (Confuser) 😈
장난스러운 악당 (재미 요소)

#### 오일러 박사 👨‍🔬
도형 창작 실험실의 안내자

#### 신라 공주 👸
주령구 레벨의 안내자

#### 장인 할아버지 👴
주령구 만들기 지도자

---

## 📸 스크린샷

> 스크린샷은 개발 완료 후 추가 예정

---

## 🗺️ 개발 로드맵

### Phase 1: 기본 구조 ✅
- [x] 프로젝트 계획 수립
- [x] 문서 작성
- [ ] HTML 페이지 구조
- [ ] CSS 기본 스타일링

### Phase 2: AR 기능 🚧
- [ ] 마커 기반 AR 구현
- [ ] 마커리스 AR 구현
- [ ] 기본 도형 표시

### Phase 3: 레벨 시스템 📋
- [ ] 레벨 1-2 구현
- [ ] 레벨 3-4 구현
- [ ] 레벨 5-6 구현
- [ ] 레벨 7 (주령구) 구현

### Phase 4: 게이미피케이션 📋
- [ ] 수집 시스템
- [ ] 보상 시스템
- [ ] 상점 시스템
- [ ] 미니게임 6종

### Phase 5: 최적화 📋
- [ ] 모바일 최적화
- [ ] 성능 개선
- [ ] 테스트 및 버그 수정

---

## 🤝 기여 방법

프로젝트에 기여하고 싶으신가요? 환영합니다!

### 1. Fork 하기
```bash
# 저장소 Fork
# GitHub에서 "Fork" 버튼 클릭
```

### 2. 브랜치 생성
```bash
git checkout -b feature/amazing-feature
```

### 3. 변경사항 커밋
```bash
git commit -m 'Add some amazing feature'
```

### 4. 푸시
```bash
git push origin feature/amazing-feature
```

### 5. Pull Request 생성
GitHub에서 Pull Request 생성

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

```
MIT License

Copyright (c) 2026 nanasand

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📞 문의

프로젝트에 대한 질문이나 제안이 있으신가요?

- **GitHub Issues**: [이슈 등록](https://github.com/nanasand/math-ar-learning/issues)
- **Email**: contact@example.com
- **Website**: https://example.com

---

## 🙏 감사의 말

이 프로젝트는 다음 기술과 리소스를 사용합니다:

- [A-Frame](https://aframe.io/) - WebVR 프레임워크
- [AR.js](https://ar-js-org.github.io/AR.js-Docs/) - WebAR 라이브러리
- [국립경주박물관](https://gyeongju.museum.go.kr/) - 주령구 자료 참고

---

## 📚 추가 문서

- [프로젝트 계획서](docs/PROJECT_PLAN.md)
- [교육 콘텐츠 상세](docs/EDUCATIONAL_CONTENT.md)
- [주령구 가이드](docs/JURYEONGGU_GUIDE.md)
- [캐릭터 설계](docs/CHARACTER_DESIGN.md)
- [개발 로드맵](docs/DEVELOPMENT_ROADMAP.md)

---

<div align="center">

**Made with ❤️ for Korean Elementary Students**

⭐ 이 프로젝트가 마음에 드신다면 Star를 눌러주세요! ⭐

</div>
