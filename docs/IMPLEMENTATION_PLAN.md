# 🚀 구현 계획서 (Implementation Plan)

## 📋 목차

- [프로젝트 구조 상세](#프로젝트-구조-상세)
- [Phase별 구현 계획](#phase별-구현-계획)
- [데이터 구조 설계](#데이터-구조-설계)
- [핵심 기능 구현 가이드](#핵심-기능-구현-가이드)
- [UI/UX 설계 가이드](#uiux-설계-가이드)
- [성능 최적화 전략](#성능-최적화-전략)
- [테스트 체크리스트](#테스트-체크리스트)
- [배포 가이드](#배포-가이드)

---

## 📁 프로젝트 구조 상세

### 전체 파일 트리

```
math/
├── index.html                    # 메인 페이지 (레벨 선택)
├── ar-marker.html               # 마커 기반 AR 뷰어
├── ar-markerless.html           # 마커리스 AR 뷰어
├── quiz.html                    # 퀴즈 페이지
├── progress.html                # 진행도 및 통계
├── shop.html                    # 아이템 상점
├── collection.html              # 도형 도감
├── minigames.html               # 미니게임 모음
├── juryeonggu.html              # 주령구 특별 페이지
│
├── css/                         # 스타일시트
│   ├── style.css                # 전역 스타일 (색상, 타이포, 레이아웃)
│   ├── responsive.css           # 반응형 디자인 (모바일/태블릿/데스크톱)
│   ├── ar-ui.css                # AR UI 오버레이
│   ├── level-select.css         # 레벨 선택 화면
│   ├── character.css            # 캐릭터 애니메이션
│   └── minigames.css            # 미니게임 스타일
│
├── js/                          # JavaScript 파일
│   ├── app.js                   # 메인 애플리케이션 (초기화, 라우팅)
│   ├── ar-marker.js             # 마커 기반 AR 컨트롤러
│   ├── ar-markerless.js         # 마커리스 AR 컨트롤러
│   ├── geometry-shapes.js       # 도형 생성 및 관리
│   ├── level-manager.js         # 레벨 시스템 관리
│   ├── quiz-system.js           # 퀴즈 엔진
│   ├── progress-tracker.js      # 진행도 추적 (LocalStorage)
│   ├── shop-system.js           # 상점 시스템
│   ├── collection-manager.js    # 도감 관리
│   ├── minigames.js             # 미니게임 로직
│   ├── juryeonggu.js            # 주령구 시스템
│   ├── shape-builder.js         # 도형 창작 시스템
│   ├── character-controller.js  # 캐릭터 관리 및 대사
│   ├── sound-manager.js         # 사운드 관리
│   ├── ui-controller.js         # UI 인터랙션
│   └── utils.js                 # 유틸리티 함수
│
├── assets/                      # 리소스
│   ├── markers/                 # AR 마커 이미지
│   │   ├── hiro.png
│   │   ├── kanji.png
│   │   ├── level1-marker.png
│   │   ├── level2-marker.png
│   │   ├── level3-marker.png
│   │   ├── level4-marker.png
│   │   ├── level5-marker.png
│   │   ├── level6-marker.png
│   │   └── juryeonggu-marker.png
│   │
│   ├── images/                  # 이미지
│   │   ├── characters/          # 캐릭터 이미지
│   │   │   ├── sam.png
│   │   │   ├── nemo.png
│   │   │   ├── dongle.png
│   │   │   ├── cube.png
│   │   │   ├── sphere.png
│   │   │   ├── confuser.png
│   │   │   ├── euler.png
│   │   │   ├── princess.png
│   │   │   └── craftsman.png
│   │   │
│   │   ├── backgrounds/         # 배경 이미지
│   │   │   ├── main-bg.jpg
│   │   │   ├── level-bg.jpg
│   │   │   └── ar-bg.jpg
│   │   │
│   │   ├── ui-elements/         # UI 요소
│   │   │   ├── button.png
│   │   │   ├── panel.png
│   │   │   └── icon-sprite.png
│   │   │
│   │   └── badges/              # 배지 이미지
│   │       ├── explorer.png
│   │       ├── genius.png
│   │       └── perfectionist.png
│   │
│   ├── sounds/                  # 사운드
│   │   ├── bgm/                 # 배경음악
│   │   │   ├── main-theme.mp3
│   │   │   ├── level-theme.mp3
│   │   │   └── juryeonggu-theme.mp3
│   │   │
│   │   └── sfx/                 # 효과음
│   │       ├── correct.mp3
│   │       ├── wrong.mp3
│   │       ├── coin.mp3
│   │       ├── levelup.mp3
│   │       └── card-get.mp3
│   │
│   ├── models/                  # 3D 모델
│   │   └── juryeonggu.gltf
│   │
│   └── icons/                   # 아이콘
│       ├── favicon.ico
│       └── app-icon.png
│
├── data/                        # 데이터 파일 (JSON)
│   ├── levels.json              # 레벨 정보
│   ├── shapes-data.json         # 도형 데이터
│   ├── quiz-questions.json      # 퀴즈 문제
│   ├── characters.json          # 캐릭터 정보
│   ├── items.json               # 아이템 정보
│   ├── badges.json              # 배지 정보
│   └── juryeonggu-data.json     # 주령구 데이터
│
├── docs/                        # 문서
│   ├── PROJECT_PLAN.md          # 프로젝트 계획서
│   ├── EDUCATIONAL_CONTENT.md   # 교육 콘텐츠 상세
│   ├── JURYEONGGU_GUIDE.md      # 주령구 가이드
│   ├── CHARACTER_DESIGN.md      # 캐릭터 설계
│   ├── DEVELOPMENT_ROADMAP.md   # 개발 로드맵
│   └── IMPLEMENTATION_PLAN.md   # 구현 계획서 (이 파일)
│
├── .gitignore                   # Git 제외 파일
├── README.md                    # 프로젝트 소개
└── PROJECT_PLAN.md              # 프로젝트 계획서
```

---

## 🔨 Phase별 구현 계획

### Phase 1: 기본 구조 (1-2일)

#### Day 1: 프로젝트 설정 및 HTML

**오전 (09:00-13:00)**

1. **폴더 구조 생성** (30분)
   ```bash
   mkdir css js assets data docs
   mkdir assets/markers assets/images assets/sounds assets/models assets/icons
   mkdir assets/images/characters assets/images/backgrounds assets/images/ui-elements assets/images/badges
   mkdir assets/sounds/bgm assets/sounds/sfx
   ```

2. **.gitignore 작성** (10분)
   ```
   # OS
   .DS_Store
   Thumbs.db
   
   # IDE
   .vscode/
   .idea/
   
   # Dependencies
   node_modules/
   
   # Build
   dist/
   build/
   
   # Logs
   *.log
   
   # Temporary
   .tmp/
   temp/
   ```

3. **Git 초기화** (10분)
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Project structure"
   ```

4. **index.html 작성** (2시간)
   - 기본 HTML5 구조
   - 메타 태그 (viewport, charset, description)
   - CDN 링크 (A-Frame, AR.js)
   - 레벨 선택 UI
   - 네비게이션 메뉴

**오후 (14:00-18:00)**

5. **나머지 HTML 페이지 작성** (4시간)
   - ar-marker.html
   - ar-markerless.html
   - quiz.html
   - progress.html
   - shop.html
   - collection.html
   - minigames.html
   - juryeonggu.html

#### Day 2: CSS 및 JavaScript 기본

**오전 (09:00-13:00)**

1. **style.css 작성** (2시간)
   - CSS 변수 정의 (색상, 폰트)
   - 기본 스타일 (reset, body, typography)
   - 레이아웃 (container, grid, flex)
   - 버튼, 카드, 패널 컴포넌트

2. **responsive.css 작성** (2시간)
   - 모바일 스타일 (320px~767px)
   - 태블릿 스타일 (768px~1023px)
   - 데스크톱 스타일 (1024px~)

**오후 (14:00-18:00)**

3. **app.js 작성** (2시간)
   - 초기화 함수
   - 라우팅 시스템
   - 전역 상태 관리
   - 이벤트 리스너

4. **utils.js 작성** (1시간)
   - LocalStorage 헬퍼 함수
   - 날짜/시간 함수
   - 랜덤 함수
   - 유틸리티 함수

5. **기본 테스트** (1시간)
   - 페이지 네비게이션 확인
   - 스타일 적용 확인
   - 콘솔 에러 확인

---

### Phase 2: 마커 기반 AR (2-3일)

#### Day 3: AR 마커 및 기본 도형

**오전 (09:00-13:00)**

1. **AR 마커 생성/다운로드** (1시간)
   - Hiro 마커 다운로드
   - Kanji 마커 다운로드
   - 커스텀 마커 생성 (AR.js Marker Training)

2. **geometry-shapes.js 작성** (3시간)
   - 삼각형 생성 함수
   - 사각형 생성 함수
   - 원 생성 함수
   - 정육면체 생성 함수
   - 구 생성 함수
   - 도형 색상 및 크기 설정
   - 회전 애니메이션

**오후 (14:00-18:00)**

3. **ar-marker.js 작성** (4시간)
   - A-Frame 씬 초기화
   - 마커 등록
   - 마커 감지 이벤트
   - 도형 표시/숨김
   - 터치 인터랙션
   - 도형 정보 표시

#### Day 4: 레벨 1-2 구현

**오전 (09:00-13:00)**

1. **levels.json 작성** (1시간)
   - 레벨 1-2 데이터 정의

2. **레벨 1 구현** (3시간)
   - 평면 도형 AR 표시
   - 도형 설명 UI
   - 레벨 완료 조건

**오후 (14:00-18:00)**

3. **레벨 2 구현** (3시간)
   - 사각형 종류 AR 표시
   - 각도 표시 기능
   - 대칭축 표시

4. **테스트** (1시간)
   - 마커 인식 테스트
   - 도형 표시 테스트
   - 모바일 테스트

#### Day 5: 버그 수정 및 개선 (선택)

---

### Phase 3: 마커리스 AR (2-3일)

#### Day 6: 평면 감지 및 레벨 3

**오전 (09:00-13:00)**

1. **ar-markerless.js 작성** (2시간)
   - 평면 감지 설정
   - 도형 배치 기능

2. **레벨 3 데이터** (1시간)

3. **레벨 3 구현 시작** (1시간)

**오후 (14:00-18:00)**

4. **레벨 3 구현 완료** (4시간)
   - 입체 도형 AR 표시
   - 면/모서리/꼭짓점 강조
   - 360도 회전 기능

#### Day 7: 레벨 4 및 전개도

**오전 (09:00-13:00)**

1. **레벨 4 데이터** (1시간)

2. **레벨 4 구현** (3시간)
   - 각기둥/각뿔 AR 표시

**오후 (14:00-18:00)**

3. **전개도 애니메이션** (4시간)
   - 접기 애니메이션
   - 펼치기 애니메이션
   - 단면 보기 기능

#### Day 8: AR UI 개선 및 테스트 (선택)

---

### Phase 4: 퀴즈 시스템 (1-2일)

#### Day 9: 퀴즈 엔진

**오전 (09:00-13:00)**

1. **quiz-system.js 작성** (3시간)
   - 문제 로드 함수
   - 정답 체크 함수
   - 점수 계산 함수
   - 타이머 기능

2. **퀴즈 UI** (1시간)

**오후 (14:00-18:00)**

3. **quiz-questions.json 작성** (4시간)
   - 레벨 1: 10문제
   - 레벨 2: 15문제
   - 레벨 3: 15문제
   - 레벨 4: 20문제

#### Day 10: 레벨 5-6 및 피드백

**오전 (09:00-13:00)**

1. **레벨 5 구현** (3시간)
   - 넓이 계산 문제
   - 부피 계산 문제
   - 계산기 UI

**오후 (14:00-18:00)**

2. **레벨 6 구현** (2시간)
   - 종합 문제
   - 시간 제한 모드
   - 헷갈이 등장

3. **피드백 시스템** (2시간)
   - 정답 애니메이션
   - 오답 피드백
   - 힌트 시스템

---

### Phase 5: 주령구 시스템 (2-3일)

#### Day 11: 주령구 3D 모델 및 AR

**오전 (09:00-13:00)**

1. **주령구 3D 모델** (3시간)
   - A-Frame 기본 도형 조합
   - 14면 텍스처 적용
   - 회전 애니메이션

**오후 (14:00-18:00)**

2. **juryeonggu.js 작성** (4시간)
   - 주령구 굴리기 기능
   - 굴림 애니메이션
   - 결과 표시

#### Day 12: 주령구 게임 3종

**오전 (09:00-13:00)**

1. **게임 1: 주령구 모험** (3시간)
   - 보드게임 UI
   - 이동 로직

**오후 (14:00-18:00)**

2. **게임 2: 미션 챌린지** (2시간)

3. **게임 3: 타워 쌓기** (2시간)

#### Day 13: 역사 콘텐츠 및 통합

**오전 (09:00-13:00)**

1. **역사 콘텐츠** (3시간)
   - 역사 이야기 UI
   - 애니메이션
   - 신라 공주, 장인 캐릭터

**오후 (14:00-18:00)**

2. **레벨 7 통합** (4시간)
   - 주령구 학습 모드
   - 주령구 게임 모드
   - 역사 퀴즈

---

### Phase 6: 게이미피케이션 (2-3일)

#### Day 14: 캐릭터 및 수집 시스템

**오전 (09:00-13:00)**

1. **character-controller.js** (2시간)

2. **캐릭터 이미지 생성/수집** (2시간)

**오후 (14:00-18:00)**

3. **collection-manager.js** (4시간)
   - 도형 카드 시스템
   - 배지 시스템
   - 도감 UI

#### Day 15: 보상, 상점, 랭킹

**오전 (09:00-13:00)**

1. **progress-tracker.js** (3시간)
   - 코인 시스템
   - 경험치 시스템
   - 별점 시스템

**오후 (14:00-18:00)**

2. **shop-system.js** (2시간)

3. **랭킹 시스템** (2시간)

#### Day 16: 미니게임 6종

**전일 (09:00-18:00)**

1. **minigames.js** (8시간)
   - 도형 사냥
   - 도형 매칭
   - 도형 퍼즐
   - 도형 쌓기
   - 도형 레이싱
   - 도형 공장

---

### Phase 7: 도형 창작 (1-2일)

#### Day 17: 도형 빌더 및 검증

**오전 (09:00-13:00)**

1. **shape-builder.js** (3시간)
   - 부품 선택 UI
   - 도형 조립 로직
   - 3D 프리뷰

**오후 (14:00-18:00)**

2. **오일러 공식 검증** (2시간)

3. **과학적 설명 콘텐츠** (2시간)

---

### Phase 8: 최적화 & 테스트 (1-2일)

#### Day 18: 최적화 및 테스트

**오전 (09:00-13:00)**

1. **성능 최적화** (3시간)
   - 이미지 최적화
   - 코드 최적화
   - AR 최적화

**오후 (14:00-18:00)**

2. **크로스 브라우저 테스트** (2시간)

3. **버그 수정** (2시간)

---

## 📊 데이터 구조 설계

### levels.json

```json
{
  "levels": [
    {
      "id": 1,
      "name": "평면 도형 기초",
      "difficulty": 1,
      "icon": "⭐",
      "description": "삼각형, 사각형, 원을 배워요",
      "targetGrade": "1-2학년",
      "curriculum": ["2수03-03", "2수03-04"],
      "shapes": ["triangle", "square", "circle"],
      "quizCount": 10,
      "timeLimit": 300,
      "requiredScore": 60,
      "rewards": {
        "coins": 50,
        "xp": 100,
        "cards": ["triangle-card", "square-card", "circle-card"]
      },
      "characters": ["sam", "dongle"]
    },
    {
      "id": 2,
      "name": "평면 도형 심화",
      "difficulty": 2,
      "icon": "⭐⭐",
      "description": "각도와 사각형의 종류를 배워요",
      "targetGrade": "3-4학년",
      "curriculum": ["4수03-01", "4수03-02", "4수03-05"],
      "shapes": ["square", "rectangle", "rhombus", "parallelogram"],
      "quizCount": 15,
      "timeLimit": 450,
      "requiredScore": 70,
      "rewards": {
        "coins": 75,
        "xp": 150,
        "cards": ["rectangle-card", "rhombus-card"]
      },
      "characters": ["nemo", "sam"]
    }
    // ... 레벨 3-7
  ]
}
```

### quiz-questions.json

```json
{
  "level1": [
    {
      "id": "l1q1",
      "type": "multiple-choice",
      "question": "이 도형의 변은 몇 개일까요?",
      "shape": "triangle",
      "shapeColor": "#FF6B6B",
      "options": ["2개", "3개", "4개", "5개"],
      "answer": 1,
      "explanation": "삼각형은 변이 3개입니다!",
      "hint": "삼각형의 '삼'은 3을 의미해요",
      "difficulty": 1,
      "points": 10,
      "character": "sam"
    },
    {
      "id": "l1q2",
      "type": "multiple-choice",
      "question": "사각형의 꼭짓점은 몇 개일까요?",
      "shape": "square",
      "shapeColor": "#4A90E2",
      "options": ["2개", "3개", "4개", "5개"],
      "answer": 2,
      "explanation": "사각형은 꼭짓점이 4개입니다!",
      "hint": "사각형의 '사'는 4를 의미해요",
      "difficulty": 1,
      "points": 10,
      "character": "nemo"
    }
    // ... 10문제
  ],
  "level2": [
    // ... 15문제
  ]
  // ... 레벨 3-7
}
```

### characters.json

```json
{
  "characters": [
    {
      "id": "sam",
      "name": "삼이",
      "nameEn": "Sam",
      "shape": "triangle",
      "color": "#FF6B6B",
      "age": 8,
      "grade": "2학년",
      "personality": "활발하고 호기심 많음",
      "role": "guide",
      "specialty": "평면 도형",
      "image": "assets/images/characters/sam.png",
      "dialogues": {
        "greeting": [
          "안녕! 나는 삼이야!",
          "도형 왕국에 온 걸 환영해!",
          "같이 모험을 떠나볼까?"
        ],
        "correct": [
          "정답이야! 대단해!",
          "우와! 천재인가봐!",
          "완벽해!",
          "역시 내 친구야!"
        ],
        "wrong": [
          "아쉬워! 다시 한번 해볼까?",
          "괜찮아, 실수할 수 있어!",
          "힌트를 볼까?",
          "천천히 생각해봐!"
        ],
        "encourage": [
          "넌 할 수 있어!",
          "조금만 더 힘내!",
          "거의 다 왔어!"
        ]
      }
    }
    // ... 나머지 캐릭터
  ]
}
```

### shapes-data.json

```json
{
  "shapes": [
    {
      "id": "triangle",
      "name": "삼각형",
      "nameEn": "Triangle",
      "type": "2d",
      "category": "polygon",
      "sides": 3,
      "vertices": 3,
      "angles": 3,
      "properties": {
        "regular": false,
        "convex": true
      },
      "description": "변이 3개인 도형",
      "examples": ["삼각자", "표지판", "피라미드"],
      "color": "#FF6B6B",
      "aframe": {
        "geometry": "primitive: triangle",
        "material": "color: #FF6B6B"
      }
    },
    {
      "id": "square",
      "name": "정사각형",
      "nameEn": "Square",
      "type": "2d",
      "category": "polygon",
      "sides": 4,
      "vertices": 4,
      "angles": 4,
      "properties": {
        "regular": true,
        "convex": true,
        "allSidesEqual": true,
        "allAnglesEqual": true,
        "angleSize": 90
      },
      "description": "네 변의 길이가 같고, 네 각이 모두 직각인 도형",
      "examples": ["책", "창문", "칠판"],
      "color": "#4A90E2",
      "aframe": {
        "geometry": "primitive: plane; width: 1; height: 1",
        "material": "color: #4A90E2"
      }
    }
    // ... 나머지 도형
  ]
}
```

### items.json

```json
{
  "items": [
    {
      "id": "hint-card",
      "name": "힌트 카드",
      "description": "문제 힌트를 1개 볼 수 있어요",
      "price": 50,
      "type": "consumable",
      "icon": "💡",
      "effect": "showHint"
    },
    {
      "id": "time-extend",
      "name": "시간 연장",
      "description": "퀴즈 시간을 30초 연장해요",
      "price": 30,
      "type": "consumable",
      "icon": "⏰",
      "effect": "addTime:30"
    },
    {
      "id": "double-coin",
      "name": "더블 코인",
      "description": "1시간 동안 코인을 2배로 받아요",
      "price": 100,
      "type": "buff",
      "duration": 3600,
      "icon": "💰",
      "effect": "doubleCoin"
    }
    // ... 나머지 아이템
  ]
}
```

### badges.json

```json
{
  "badges": [
    {
      "id": "explorer",
      "name": "탐험가",
      "description": "모든 레벨을 방문했어요",
      "icon": "🗺️",
      "condition": {
        "type": "visitAllLevels"
      },
      "reward": {
        "coins": 100,
        "xp": 200
      }
    },
    {
      "id": "genius",
      "name": "수학 천재",
      "description": "100문제를 맞혔어요",
      "icon": "🧠",
      "condition": {
        "type": "correctAnswers",
        "count": 100
      },
      "reward": {
        "coins": 200,
        "xp": 300
      }
    }
    // ... 나머지 배지
  ]
}
```

---

## 💻 핵심 기능 구현 가이드

### 1. AR 시스템

#### ar-marker.js 구조

```javascript
/**
 * AR 마커 기반 컨트롤러
 */
class ARMarkerController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.markers = {};
    this.currentShape = null;
    this.isInitialized = false;
  }

  /**
   * 초기화
   */
  async init() {
    try {
      // A-Frame 씬 가져오기
      this.scene = document.querySelector('a-scene');
      this.camera = document.querySelector('a-camera');

      // 마커 등록
      this.registerMarkers();

      // 이벤트 리스너 설정
      this.setupEventListeners();

      this.isInitialized = true;
      console.log('AR Marker Controller initialized');
    } catch (error) {
      console.error('AR initialization failed:', error);
    }
  }

  /**
   * 마커 등록
   */
  registerMarkers() {
    const markerElements = document.querySelectorAll('a-marker');
    
    markerElements.forEach(marker => {
      const markerId = marker.getAttribute('id');
      this.markers[markerId] = {
        element: marker,
        isVisible: false,
        shape: null
      };

      // 마커 감지 이벤트
      marker.addEventListener('markerFound', () => {
        this.onMarkerFound(markerId);
      });

      marker.addEventListener('markerLost', () => {
        this.onMarkerLost(markerId);
      });
    });
  }

  /**
   * 마커 감지 시
   */
  onMarkerFound(markerId) {
    console.log(`Marker found: ${markerId}`);
    this.markers[markerId].isVisible = true;

    // 도형 표시
    this.showShape(markerId);

    // UI 업데이트
    this.updateUI(markerId, true);
  }

  /**
   * 마커 사라질 때
   */
  onMarkerLost(markerId) {
    console.log(`Marker lost: ${markerId}`);
    this.markers[markerId].isVisible = false;

    // UI 업데이트
    this.updateUI(markerId, false);
  }

  /**
   * 도형 표시
   */
  showShape(markerId) {
    const marker = this.markers[markerId];
    
    // 이미 도형이 있으면 제거
    if (marker.shape) {
      marker.element.removeChild(marker.shape);
    }

    // 새 도형 생성
    const shapeData = this.getShapeData(markerId);
    marker.shape = GeometryShapes.create(shapeData);

    // 마커에 추가
    marker.element.appendChild(marker.shape);
  }

  /**
   * 도형 데이터 가져오기
   */
  getShapeData(markerId) {
    // levels.json에서 데이터 가져오기
    // 또는 shapes-data.json에서
    return {
      type: 'triangle',
      color: '#FF6B6B',
      size: 1,
      animation: true
    };
  }

  /**
   * UI 업데이트
   */
  updateUI(markerId, isVisible) {
    const infoPanel = document.getElementById('shape-info');
    
    if (isVisible) {
      const shapeData = this.getShapeData(markerId);
      infoPanel.innerHTML = `
        <h3>${shapeData.name}</h3>
        <p>${shapeData.description}</p>
      `;
      infoPanel.classList.add('visible');
    } else {
      infoPanel.classList.remove('visible');
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 터치 이벤트
    this.scene.addEventListener('click', (e) => {
      this.onSceneClick(e);
    });
  }

  /**
   * 씬 클릭 시
   */
  onSceneClick(event) {
    // 도형 클릭 감지
    // 정보 표시 등
  }
}

// 전역 인스턴스
const arController = new ARMarkerController();

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
  arController.init();
});
```

#### geometry-shapes.js 구조

```javascript
/**
 * 도형 생성 및 관리
 */
class GeometryShapes {
  /**
   * 도형 생성
   */
  static create(config) {
    const { type, color, size, animation } = config;

    switch (type) {
      case 'triangle':
        return this.createTriangle(color, size, animation);
      case 'square':
        return this.createSquare(color, size, animation);
      case 'circle':
        return this.createCircle(color, size, animation);
      case 'cube':
        return this.createCube(color, size, animation);
      case 'sphere':
        return this.createSphere(color, size, animation);
      default:
        console.error(`Unknown shape type: ${type}`);
        return null;
    }
  }

  /**
   * 삼각형 생성
   */
  static createTriangle(color = '#FF6B6B', size = 1, animation = true) {
    const entity = document.createElement('a-entity');
    
    // 삼각형 geometry
    entity.setAttribute('geometry', {
      primitive: 'triangle',
      vertexA: { x: 0, y: size, z: 0 },
      vertexB: { x: -size * 0.866, y: -size * 0.5, z: 0 },
      vertexC: { x: size * 0.866, y: -size * 0.5, z: 0 }
    });

    // Material
    entity.setAttribute('material', {
      color: color,
      side: 'double'
    });

    // Position
    entity.setAttribute('position', { x: 0, y: 0, z: 0 });

    // Animation
    if (animation) {
      entity.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 10000,
        easing: 'linear'
      });
    }

    return entity;
  }

  /**
   * 정사각형 생성
   */
  static createSquare(color = '#4A90E2', size = 1, animation = true) {
    const entity = document.createElement('a-plane');
    
    entity.setAttribute('width', size);
    entity.setAttribute('height', size);
    entity.setAttribute('color', color);
    entity.setAttribute('position', { x: 0, y: 0, z: 0 });

    if (animation) {
      entity.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 10000,
        easing: 'linear'
      });
    }

    return entity;
  }

  /**
   * 원 생성
   */
  static createCircle(color = '#FFD93D', size = 1, animation = true) {
    const entity = document.createElement('a-circle');
    
    entity.setAttribute('radius', size * 0.5);
    entity.setAttribute('color', color);
    entity.setAttribute('position', { x: 0, y: 0, z: 0 });

    if (animation) {
      entity.setAttribute('animation', {
        property: 'scale',
        to: '1.2 1.2 1.2',
        direction: 'alternate',
        loop: true,
        dur: 2000,
        easing: 'easeInOutQuad'
      });
    }

    return entity;
  }

  /**
   * 정육면체 생성
   */
  static createCube(color = '#9B59B6', size = 1, animation = true) {
    const entity = document.createElement('a-box');
    
    entity.setAttribute('width', size);
    entity.setAttribute('height', size);
    entity.setAttribute('depth', size);
    entity.setAttribute('color', color);
    entity.setAttribute('position', { x: 0, y: 0, z: 0 });

    if (animation) {
      entity.setAttribute('animation', {
        property: 'rotation',
        to: '360 360 0',
        loop: true,
        dur: 15000,
        easing: 'linear'
      });
    }

    return entity;
  }

  /**
   * 구 생성
   */
  static createSphere(color = '#87CEEB', size = 1, animation = true) {
    const entity = document.createElement('a-sphere');
    
    entity.setAttribute('radius', size * 0.5);
    entity.setAttribute('color', color);
    entity.setAttribute('position', { x: 0, y: 0, z: 0 });

    if (animation) {
      entity.setAttribute('animation', {
        property: 'position',
        to: { x: 0, y: 0.2, z: 0 },
        direction: 'alternate',
        loop: true,
        dur: 2000,
        easing: 'easeInOutQuad'
      });
    }

    return entity;
  }
}
```

### 2. 퀴즈 시스템

#### quiz-system.js 구조

```javascript
/**
 * 퀴즈 시스템
 */
class QuizSystem {
  constructor(levelId) {
    this.levelId = levelId;
    this.questions = [];
    this.currentIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.timer = null;
    this.timeRemaining = 0;
    this.isFinished = false;
  }

  /**
   * 초기화
   */
  async init() {
    try {
      // 문제 로드
      await this.loadQuestions();

      // UI 설정
      this.setupUI();

      // 타이머 시작
      this.startTimer();

      // 첫 문제 표시
      this.showQuestion(0);

      console.log(`Quiz initialized for level ${this.levelId}`);
    } catch (error) {
      console.error('Quiz initialization failed:', error);
    }
  }

  /**
   * 문제 로드
   */
  async loadQuestions() {
    try {
      const response = await fetch('data/quiz-questions.json');
      const data = await response.json();
      
      this.questions = data[`level${this.levelId}`];
      
      if (!this.questions || this.questions.length === 0) {
        throw new Error(`No questions found for level ${this.levelId}`);
      }

      // 문제 섞기 (선택사항)
      // this.questions = this.shuffleArray(this.questions);

      console.log(`Loaded ${this.questions.length} questions`);
    } catch (error) {
      console.error('Failed to load questions:', error);
      throw error;
    }
  }

  /**
   * UI 설정
   */
  setupUI() {
    // 진행률 표시
    this.updateProgress();

    // 이벤트 리스너
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        this.selectAnswer(index);
      });
    });

    // 힌트 버튼
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        this.showHint();
      });
    }

    // 다음 버튼
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextQuestion();
      });
    }
  }

  /**
   * 문제 표시
   */
  showQuestion(index) {
    if (index >= this.questions.length) {
      this.finishQuiz();
      return;
    }

    this.currentIndex = index;
    const question = this.questions[index];

    // 문제 텍스트
    document.getElementById('question-text').textContent = question.question;

    // 도형 표시 (AR 또는 이미지)
    if (question.shape) {
      this.showShape(question.shape, question.shapeColor);
    }

    // 선택지
    const optionButtons = document.querySelectorAll('.option-btn');
    question.options.forEach((option, i) => {
      if (optionButtons[i]) {
        optionButtons[i].textContent = option;
        optionButtons[i].disabled = false;
        optionButtons[i].classList.remove('correct', 'wrong', 'selected');
      }
    });

    // 캐릭터 대사
    if (question.character) {
      this.showCharacterDialogue(question.character, 'question');
    }

    // 진행률 업데이트
    this.updateProgress();

    // 다음 버튼 숨김
    document.getElementById('next-btn').style.display = 'none';
  }

  /**
   * 도형 표시
   */
  showShape(shapeType, color) {
    const shapeContainer = document.getElementById('shape-container');
    
    // AR 모드인 경우
    if (this.isARMode()) {
      // AR로 도형 표시
      // arController.showShape(shapeType, color);
    } else {
      // 이미지로 표시
      shapeContainer.innerHTML = `
        <div class="shape ${shapeType}" style="background-color: ${color}"></div>
      `;
    }
  }

  /**
   * 정답 선택
   */
  selectAnswer(selectedIndex) {
    const question = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === question.answer;

    // 버튼 비활성화
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => btn.disabled = true);

    // 선택한 버튼 표시
    optionButtons[selectedIndex].classList.add('selected');

    // 정답/오답 처리
    if (isCorrect) {
      this.onCorrectAnswer(selectedIndex);
    } else {
      this.onWrongAnswer(selectedIndex, question.answer);
    }

    // 다음 버튼 표시
    setTimeout(() => {
      document.getElementById('next-btn').style.display = 'block';
    }, 1500);
  }

  /**
   * 정답 처리
   */
  onCorrectAnswer(selectedIndex) {
    const question = this.questions[this.currentIndex];
    
    // 점수 추가
    this.score += question.points || 10;
    this.correctCount++;

    // 버튼 스타일
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons[selectedIndex].classList.add('correct');

    // 효과음
    SoundManager.play('correct');

    // 애니메이션
    this.showFeedback('correct');

    // 캐릭터 대사
    if (question.character) {
      this.showCharacterDialogue(question.character, 'correct');
    }

    // 해설 표시
    this.showExplanation(question.explanation);

    // 진행도 업데이트
    ProgressTracker.addXP(question.points || 10);
    ProgressTracker.addCoins(10);
  }

  /**
   * 오답 처리
   */
  onWrongAnswer(selectedIndex, correctIndex) {
    const question = this.questions[this.currentIndex];
    
    this.wrongCount++;

    // 버튼 스타일
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons[selectedIndex].classList.add('wrong');
    optionButtons[correctIndex].classList.add('correct');

    // 효과음
    SoundManager.play('wrong');

    // 애니메이션
    this.showFeedback('wrong');

    // 캐릭터 대사
    if (question.character) {
      this.showCharacterDialogue(question.character, 'wrong');
    }

    // 해설 표시
    this.showExplanation(question.explanation);
  }

  /**
   * 피드백 표시
   */
  showFeedback(type) {
    const feedbackEl = document.getElementById('feedback');
    
    if (type === 'correct') {
      feedbackEl.textContent = '정답입니다! 🎉';
      feedbackEl.className = 'feedback correct';
    } else {
      feedbackEl.textContent = '아쉬워요! 다시 도전해봐요! 💪';
      feedbackEl.className = 'feedback wrong';
    }

    feedbackEl.style.display = 'block';

    setTimeout(() => {
      feedbackEl.style.display = 'none';
    }, 2000);
  }

  /**
   * 해설 표시
   */
  showExplanation(explanation) {
    const explanationEl = document.getElementById('explanation');
    explanationEl.textContent = explanation;
    explanationEl.style.display = 'block';
  }

  /**
   * 캐릭터 대사 표시
   */
  async showCharacterDialogue(characterId, type) {
    try {
      const response = await fetch('data/characters.json');
      const data = await response.json();
      
      const character = data.characters.find(c => c.id === characterId);
      if (!character) return;

      const dialogues = character.dialogues[type];
      if (!dialogues || dialogues.length === 0) return;

      // 랜덤 대사 선택
      const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)];

      // 대사 표시
      const dialogueEl = document.getElementById('character-dialogue');
      const characterImg = document.getElementById('character-img');

      characterImg.src = character.image;
      dialogueEl.textContent = dialogue;
      dialogueEl.style.display = 'block';

    } catch (error) {
      console.error('Failed to show character dialogue:', error);
    }
  }

  /**
   * 힌트 표시
   */
  showHint() {
    const question = this.questions[this.currentIndex];
    
    if (!question.hint) {
      alert('이 문제에는 힌트가 없어요!');
      return;
    }

    // 힌트 아이템 사용
    if (!ProgressTracker.useItem('hint-card')) {
      alert('힌트 카드가 없어요! 상점에서 구매하세요.');
      return;
    }

    // 힌트 표시
    const hintEl = document.getElementById('hint');
    hintEl.textContent = `💡 힌트: ${question.hint}`;
    hintEl.style.display = 'block';
  }

  /**
   * 다음 문제
   */
  nextQuestion() {
    this.currentIndex++;
    
    if (this.currentIndex >= this.questions.length) {
      this.finishQuiz();
    } else {
      this.showQuestion(this.currentIndex);
    }
  }

  /**
   * 타이머 시작
   */
  async startTimer() {
    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      
      const level = data.levels.find(l => l.id === this.levelId);
      this.timeRemaining = level.timeLimit || 300; // 기본 5분

      this.timer = setInterval(() => {
        this.timeRemaining--;
        this.updateTimer();

        if (this.timeRemaining <= 0) {
          this.finishQuiz();
        }
      }, 1000);

    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  }

  /**
   * 타이머 업데이트
   */
  updateTimer() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    
    const timerEl = document.getElementById('timer');
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // 시간 부족 경고
    if (this.timeRemaining <= 30) {
      timerEl.classList.add('warning');
    }
  }

  /**
   * 진행률 업데이트
   */
  updateProgress() {
    const progressEl = document.getElementById('progress');
    const progressText = `${this.currentIndex + 1} / ${this.questions.length}`;
    progressEl.textContent = progressText;

    const progressBar = document.getElementById('progress-bar');
    const percentage = ((this.currentIndex + 1) / this.questions.length) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  /**
   * 퀴즈 종료
   */
  finishQuiz() {
    if (this.isFinished) return;
    this.isFinished = true;

    // 타이머 정지
    if (this.timer) {
      clearInterval(this.timer);
    }

    // 결과 계산
    const totalQuestions = this.questions.length;
    const percentage = Math.round((this.correctCount / totalQuestions) * 100);
    const stars = this.calculateStars(percentage);

    // 결과 표시
    this.showResult({
      score: this.score,
      correctCount: this.correctCount,
      wrongCount: this.wrongCount,
      totalQuestions: totalQuestions,
      percentage: percentage,
      stars: stars
    });

    // 진행도 저장
    ProgressTracker.updateLevel(this.levelId, stars, this.score);

    // 보상 지급
    this.giveRewards(stars);
  }

  /**
   * 별점 계산
   */
  calculateStars(percentage) {
    if (percentage >= 100) return 3;
    if (percentage >= 80) return 2;
    if (percentage >= 60) return 1;
    return 0;
  }

  /**
   * 결과 표시
   */
  showResult(result) {
    // 퀴즈 화면 숨김
    document.getElementById('quiz-container').style.display = 'none';

    // 결과 화면 표시
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'block';

    // 결과 데이터 표시
    document.getElementById('result-score').textContent = result.score;
    document.getElementById('result-correct').textContent = result.correctCount;
    document.getElementById('result-wrong').textContent = result.wrongCount;
    document.getElementById('result-percentage').textContent = `${result.percentage}%`;

    // 별점 표시
    const starsContainer = document.getElementById('result-stars');
    starsContainer.innerHTML = '⭐'.repeat(result.stars);

    // 메시지
    let message = '';
    if (result.stars === 3) {
      message = '완벽해요! 🎉';
    } else if (result.stars === 2) {
      message = '잘했어요! 👍';
    } else if (result.stars === 1) {
      message = '괜찮아요! 💪';
    } else {
      message = '다시 도전해봐요! 😊';
    }
    document.getElementById('result-message').textContent = message;
  }

  /**
   * 보상 지급
   */
  async giveRewards(stars) {
    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      
      const level = data.levels.find(l => l.id === this.levelId);
      if (!level || !level.rewards) return;

      const rewards = level.rewards;

      // 코인
      const coins = rewards.coins * stars;
      ProgressTracker.addCoins(coins);

      // 경험치
      const xp = rewards.xp * stars;
      ProgressTracker.addXP(xp);

      // 카드
      if (rewards.cards && stars >= 2) {
        rewards.cards.forEach(cardId => {
          ProgressTracker.unlockCard(cardId);
        });
      }

      // 보상 표시
      this.showRewards({ coins, xp, cards: rewards.cards });

    } catch (error) {
      console.error('Failed to give rewards:', error);
    }
  }

  /**
   * 보상 표시
   */
  showRewards(rewards) {
    const rewardsEl = document.getElementById('rewards');
    rewardsEl.innerHTML = `
      <div class="reward-item">
        <span class="icon">🪙</span>
        <span class="amount">+${rewards.coins}</span>
      </div>
      <div class="reward-item">
        <span class="icon">⭐</span>
        <span class="amount">+${rewards.xp} XP</span>
      </div>
    `;

    if (rewards.cards && rewards.cards.length > 0) {
      rewardsEl.innerHTML += `
        <div class="reward-item">
          <span class="icon">🃏</span>
          <span class="amount">카드 ${rewards.cards.length}장</span>
        </div>
      `;
    }
  }

  /**
   * AR 모드 확인
   */
  isARMode() {
    return window.location.pathname.includes('ar-');
  }

  /**
   * 배열 섞기
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
  // URL에서 레벨 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const levelId = parseInt(urlParams.get('level')) || 1;

  // 퀴즈 시스템 초기화
  const quiz = new QuizSystem(levelId);
  quiz.init();
});
```

### 3. 진행도 추적

#### progress-tracker.js 구조

```javascript
/**
 * 진행도 추적 시스템
 */
class ProgressTracker {
  constructor() {
    this.data = this.loadFromStorage();
  }

  /**
   * LocalStorage에서 로드
   */
  loadFromStorage() {
    const saved = localStorage.getItem('mathAR_progress');
    
    if (saved) {
      return JSON.parse(saved);
    }

    // 기본 데이터
    return {
      player: {
        name: '플레이어',
        level: 1,
        xp: 0,
        coins: 0,
        totalScore: 0
      },
      levels: {
        1: { stars: 0, score: 0, completed: false },
        2: { stars: 0, score: 0, completed: false },
        3: { stars: 0, score: 0, completed: false },
        4: { stars: 0, score: 0, completed: false },
        5: { stars: 0, score: 0, completed: false },
        6: { stars: 0, score: 0, completed: false },
        7: { stars: 0, score: 0, completed: false }
      },
      cards: [],
      badges: [],
      items: {},
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        playTime: 0,
        lastPlayed: null
      }
    };
  }

  /**
   * LocalStorage에 저장
   */
  saveToStorage() {
    localStorage.setItem('mathAR_progress', JSON.stringify(this.data));
  }

  /**
   * 레벨 진행도 업데이트
   */
  updateLevel(levelId, stars, score) {
    const level = this.data.levels[levelId];
    
    // 최고 기록 갱신
    if (stars > level.stars) {
      level.stars = stars;
    }
    
    if (score > level.score) {
      level.score = score;
    }

    level.completed = true;

    this.saveToStorage();
  }

  /**
   * 코인 추가
   */
  addCoins(amount) {
    this.data.player.coins += amount;
    this.saveToStorage();

    // UI 업데이트
    this.updateCoinDisplay();

    // 애니메이션
    this.showCoinAnimation(amount);
  }

  /**
   * 코인 사용
   */
  useCoins(amount) {
    if (this.data.player.coins < amount) {
      return false;
    }

    this.data.player.coins -= amount;
    this.saveToStorage();

    // UI 업데이트
    this.updateCoinDisplay();

    return true;
  }

  /**
   * 경험치 추가
   */
  addXP(amount) {
    this.data.player.xp += amount;

    // 레벨업 체크
    this.checkLevelUp();

    this.saveToStorage();

    // UI 업데이트
    this.updateXPDisplay();
  }

  /**
   * 레벨업 체크
   */
  checkLevelUp() {
    const currentLevel = this.data.player.level;
    const currentXP = this.data.player.xp;

    // 레벨업 필요 경험치 (레벨 * 100)
    const requiredXP = currentLevel * 100;

    if (currentXP >= requiredXP) {
      this.data.player.level++;
      this.data.player.xp -= requiredXP;

      // 레벨업 애니메이션
      this.showLevelUpAnimation();

      // 보상
      this.addCoins(50);

      // 재귀 체크 (연속 레벨업)
      this.checkLevelUp();
    }
  }

  /**
   * 카드 획득
   */
  unlockCard(cardId) {
    if (!this.data.cards.includes(cardId)) {
      this.data.cards.push(cardId);
      this.saveToStorage();

      // 애니메이션
      this.showCardAnimation(cardId);
    }
  }

  /**
   * 배지 획득
   */
  unlockBadge(badgeId) {
    if (!this.data.badges.includes(badgeId)) {
      this.data.badges.push(badgeId);
      this.saveToStorage();

      // 애니메이션
      this.showBadgeAnimation(badgeId);
    }
  }

  /**
   * 아이템 사용
   */
  useItem(itemId) {
    const count = this.data.items[itemId] || 0;
    
    if (count <= 0) {
      return false;
    }

    this.data.items[itemId]--;
    this.saveToStorage();

    return true;
  }

  /**
   * 아이템 추가
   */
  addItem(itemId, count = 1) {
    this.data.items[itemId] = (this.data.items[itemId] || 0) + count;
    this.saveToStorage();
  }

  /**
   * 통계 업데이트
   */
  updateStats(type, value) {
    switch (type) {
      case 'question':
        this.data.stats.totalQuestions++;
        break;
      case 'correct':
        this.data.stats.correctAnswers++;
        break;
      case 'wrong':
        this.data.stats.wrongAnswers++;
        break;
      case 'playTime':
        this.data.stats.playTime += value;
        break;
    }

    this.data.stats.lastPlayed = new Date().toISOString();
    this.saveToStorage();
  }

  /**
   * 진행도 가져오기
   */
  getProgress() {
    return this.data;
  }

  /**
   * 진행도 초기화
   */
  reset() {
    if (confirm('정말로 진행도를 초기화하시겠습니까?')) {
      localStorage.removeItem('mathAR_progress');
      this.data = this.loadFromStorage();
      location.reload();
    }
  }

  /**
   * UI 업데이트 함수들
   */
  updateCoinDisplay() {
    const coinEl = document.getElementById('coin-count');
    if (coinEl) {
      coinEl.textContent = this.data.player.coins;
    }
  }

  updateXPDisplay() {
    const xpEl = document.getElementById('xp-count');
    const levelEl = document.getElementById('player-level');
    
    if (xpEl) {
      xpEl.textContent = this.data.player.xp;
    }
    
    if (levelEl) {
      levelEl.textContent = `Lv.${this.data.player.level}`;
    }

    // 경험치 바
    const xpBar = document.getElementById('xp-bar');
    if (xpBar) {
      const requiredXP = this.data.player.level * 100;
      const percentage = (this.data.player.xp / requiredXP) * 100;
      xpBar.style.width = `${percentage}%`;
    }
  }

  /**
   * 애니메이션 함수들
   */
  showCoinAnimation(amount) {
    // 코인 획득 애니메이션
    const animation = document.createElement('div');
    animation.className = 'coin-animation';
    animation.textContent = `+${amount} 🪙`;
    document.body.appendChild(animation);

    setTimeout(() => {
      animation.remove();
    }, 2000);
  }

  showLevelUpAnimation() {
    // 레벨업 애니메이션
    const animation = document.createElement('div');
    animation.className = 'levelup-animation';
    animation.innerHTML = `
      <h2>레벨업! 🎉</h2>
      <p>Lv.${this.data.player.level}</p>
    `;
    document.body.appendChild(animation);

    SoundManager.play('levelup');

    setTimeout(() => {
      animation.remove();
    }, 3000);
  }

  showCardAnimation(cardId) {
    // 카드 획득 애니메이션
    console.log(`Card unlocked: ${cardId}`);
  }

  showBadgeAnimation(badgeId) {
    // 배지 획득 애니메이션
    console.log(`Badge unlocked: ${badgeId}`);
  }
}

// 전역 인스턴스
const ProgressTracker = new ProgressTracker();
```

---

## 🎨 UI/UX 설계 가이드

### 색상 팔레트

```css
:root {
  /* 메인 캐릭터 색상 */
  --color-sam: #FF6B6B;      /* 삼이 - 빨강 */
  --color-nemo: #4A90E2;     /* 네모 - 파랑 */
  --color-dongle: #FFD93D;   /* 동글이 - 노랑 */
  --color-cube: #9B59B6;     /* 큐브 - 보라 */
  --color-sphere: #87CEEB;   /* 스피어 - 하늘 */
  
  /* UI 색상 */
  --color-primary: #4A90E2;
  --color-secondary: #FF6B6B;
  --color-success: #2ECC71;
  --color-warning: #F39C12;
  --color-danger: #E74C3C;
  --color-info: #3498DB;
  
  /* 배경 색상 */
  --color-bg-light: #F8F9FA;
  --color-bg-dark: #2C3E50;
  --color-bg-card: #FFFFFF;
  
  /* 텍스트 색상 */
  --color-text-primary: #2C3E50;
  --color-text-secondary: #7F8C8D;
  --color-text-light: #FFFFFF;
  
  /* 그림자 */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
  
  /* 테두리 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 16px;
  --border-radius-full: 9999px;
  
  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 폰트 크기 */
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-md: 1rem;      /* 16px */
  --font-size-lg: 1.25rem;   /* 20px */
  --font-size-xl: 1.5rem;    /* 24px */
  --font-size-2xl: 2rem;     /* 32px */
  --font-size-3xl: 2.5rem;   /* 40px */
  
  /* 폰트 굵기 */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 전환 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

### 타이포그래피

```css
/* 폰트 임포트 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');

/* 기본 스타일 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Noto Sans KR', sans-serif;
  font-size: var(--font-size-md);
  line-height: 1.6;
  color: var(--color-text-primary);
  background-color: var(--color-bg-light);
}

/* 제목 */
h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-lg);
}

h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-md);
}

h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
}

/* 본문 */
p {
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-md);
}

/* 링크 */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-secondary);
}
```

### 컴포넌트 스타일

```css
/* 버튼 */
.btn {
  display: inline-block;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  text-align: center;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-light);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-light);
}

.btn-success {
  background-color: var(--color-success);
  color: var(--color-text-light);
}

/* 카드 */
.card {
  background-color: var(--color-bg-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  transition: transform var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* 패널 */
.panel {
  background-color: var(--color-bg-card);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

/* 배지 */
.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius-full);
  background-color: var(--color-primary);
  color: var(--color-text-light);
}

/* 진행률 바 */
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #E0E0E0;
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background-color: var(--color-success);
  transition: width var(--transition-normal);
}
```

### 반응형 브레이크포인트

```css
/* 모바일 (기본) */
.container {
  width: 100%;
  padding: var(--spacing-md);
}

/* 태블릿 */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
  
  h1 { font-size: 3rem; }
  h2 { font-size: 2.5rem; }
}

/* 데스크톱 */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
  
  h1 { font-size: 3.5rem; }
  h2 { font-size: 3rem; }
}

/* 대형 데스크톱 */
@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## ⚡ 성능 최적화 전략

### 1. 이미지 최적화

```javascript
// 이미지 레이지 로딩
document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
});
```

### 2. 코드 최적화

```javascript
// 디바운스 함수
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 사용 예시
window.addEventListener('resize', debounce(() => {
  console.log('Resized');
}, 250));
```

### 3. AR 최적화

```javascript
// 폴리곤 수 최소화
AFRAME.registerComponent('low-poly', {
  init: function () {
    this.el.setAttribute('geometry', {
      segmentsWidth: 8,
      segmentsHeight: 8
    });
  }
});

// 텍스처 크기 최적화
AFRAME.registerComponent('optimized-texture', {
  init: function () {
    this.el.setAttribute('material', {
      src: 'texture-512.jpg', // 512x512 대신 1024x1024
      repeat: '1 1'
    });
  }
});
```

---

## ✅ 테스트 체크리스트

### 기능 테스트

#### AR 기능
- [ ] 마커 인식 정상 작동
- [ ] 도형 표시 정상
- [ ] 도형 회전 애니메이션
- [ ] 터치 인터랙션
- [ ] 마커리스 평면 감지

#### 퀴즈 시스템
- [ ] 문제 로드
- [ ] 정답/오답 처리
- [ ] 점수 계산
- [ ] 타이머 작동
- [ ] 힌트 표시

#### 진행도 추적
- [ ] LocalStorage 저장/로드
- [ ] 코인 추가/사용
- [ ] 경험치 및 레벨업
- [ ] 카드/배지 획득

### 브라우저 호환성

- [ ] Chrome (Android)
- [ ] Chrome (iOS)
- [ ] Safari (iOS)
- [ ] Samsung Internet
- [ ] Firefox
- [ ] Edge

### 성능 테스트

- [ ] 로딩 시간 < 3초
- [ ] AR 모드 FPS > 30
- [ ] 메모리 사용량 < 200MB

---

## 🚀 배포 가이드

### GitHub Pages 배포

```bash
# gh-pages 브랜치 생성
git checkout -b gh-pages

# 빌드 (필요시)
# npm run build

# 커밋 및 푸시
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# GitHub 설정
# Settings > Pages > Source: gh-pages branch
```

### Netlify 배포

```bash
# netlify.toml 생성
cat > netlify.toml << EOF
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
EOF

# 배포
netlify deploy --prod
```

### 배포 체크리스트

- [ ] 모든 기능 테스트 완료
- [ ] 성능 최적화 완료
- [ ] 이미지 압축
- [ ] 코드 압축 (Minify)
- [ ] 문서 작성 완료
- [ ] 도메인 설정
- [ ] SSL 인증서 설정
- [ ] 분석 도구 설정
- [ ] 에러 추적 설정

---

**작성일**: 2026년 5월 16일  
**버전**: 1.0  
**작성자**: Cline AI Assistant
