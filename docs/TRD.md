# 🔧 TRD (Technical Requirements Document)
## 기술 요구사항 명세서

**프로젝트명**: 초등학생용 기하학 AR 학습 웹앱  
**버전**: 1.0  
**작성일**: 2026년 5월 18일  
**작성자**: Cline AI Assistant  
**상태**: Draft

---

## 📌 목차

1. [개발 환경](#1-개발-환경)
2. [기술 스택 상세](#2-기술-스택-상세)
3. [코드 구조 및 패턴](#3-코드-구조-및-패턴)
4. [API 명세](#4-api-명세)
5. [성능 최적화](#5-성능-최적화)
6. [보안 구현](#6-보안-구현)
7. [테스트 전략](#7-테스트-전략)
8. [배포 전략](#8-배포-전략)
9. [모니터링 및 로깅](#9-모니터링-및-로깅)
10. [유지보수 가이드](#10-유지보수-가이드)

---

## 1. 개발 환경

### 1.1 필수 도구

#### 1.1.1 IDE
- **Visual Studio Code** (권장)
- **버전**: 1.80 이상

**필수 확장**:
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ritwickdey.liveserver",
    "formulahendry.auto-rename-tag",
    "pranaygp.vscode-css-peek"
  ]
}
```

**설정** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.tabSize": 2,
  "files.eol": "\n",
  "javascript.preferences.quoteStyle": "single",
  "css.lint.unknownAtRules": "ignore"
}
```

#### 1.1.2 브라우저
- **Chrome** 90+ (주 개발 브라우저)
- **Chrome DevTools** (디버깅)
- **AR.js Marker Training** (마커 생성)

#### 1.1.3 버전 관리
- **Git** 2.30+
- **GitHub** (원격 저장소)

### 1.2 선택 도구

- **Prettier** (코드 포맷팅)
- **ESLint** (코드 품질)
- **Live Server** (로컬 개발 서버)
- **Lighthouse** (성능 측정)

### 1.3 개발 서버 설정

#### 로컬 서버 실행

**방법 1: VS Code Live Server**
```
1. Live Server 확장 설치
2. index.html 우클릭
3. "Open with Live Server" 선택
4. http://localhost:5500 접속
```

**방법 2: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# 접속: http://localhost:8000
```

**방법 3: Node.js http-server**
```bash
# 설치
npm install -g http-server

# 실행
http-server -p 8000

# 접속: http://localhost:8000
```

### 1.4 Git Workflow

#### 브랜치 전략

```
main (프로덕션)
  ↑
develop (개발)
  ↑
feature/phase-3 (기능 개발)
```

#### 커밋 메시지 규칙

```
<type>(<scope>): <subject>

type:
  - feat: 새 기능
  - fix: 버그 수정
  - docs: 문서 변경
  - style: 코드 포맷팅
  - refactor: 리팩토링
  - test: 테스트 추가
  - chore: 빌드/설정 변경

예시:
feat(ar): Add markerless AR support
fix(quiz): Fix answer validation bug
docs(readme): Update installation guide
```

---

## 2. 기술 스택 상세

### 2.1 프론트엔드 기술

#### 2.1.1 HTML5
**버전**: HTML5  
**DOCTYPE**: `<!DOCTYPE html>`

**필수 메타 태그**:
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="초등학생용 AR 기하학 학습">
<meta name="theme-color" content="#667eea">
```

**시맨틱 태그 사용**:
- `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`

#### 2.1.2 CSS3
**버전**: CSS3  
**전처리기**: 없음 (순수 CSS)

**레이아웃 기술**:
- **Flexbox**: 1차원 레이아웃
- **Grid**: 2차원 레이아웃
- **Media Queries**: 반응형 디자인

**CSS 변수 사용**:
```css
:root {
  /* 색상 */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #51cf66;
  --danger-color: #ff6b6b;
  --warning-color: #ffd43b;
  
  /* 간격 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 폰트 */
  --font-family: 'Noto Sans KR', sans-serif;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  
  /* 그림자 */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
  
  /* 전환 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

#### 2.1.3 JavaScript
**버전**: ES6+ (ES2015 이상)  
**모듈 시스템**: ES6 Modules (선택사항)

**사용 기능**:
- Arrow Functions
- Template Literals
- Destructuring
- Spread/Rest Operators
- Classes
- Promises
- Async/Await
- LocalStorage API
- Fetch API

**폴리필**: 불필요 (최신 브라우저만 지원)

### 2.2 AR 기술

#### 2.2.1 A-Frame
**버전**: 1.4.0  
**CDN**: `https://aframe.io/releases/1.4.0/aframe.min.js`

**핵심 개념**:
- **Entity-Component-System (ECS)**: 모듈식 아키텍처
- **Entity**: `<a-entity>` 기본 객체
- **Component**: 재사용 가능한 기능 모듈
- **System**: 전역 로직

**주요 컴포넌트**:
```html
<!-- Geometry -->
<a-entity geometry="primitive: box; width: 1; height: 1; depth: 1"></a-entity>

<!-- Material -->
<a-entity material="color: #FF6B6B; shader: standard"></a-entity>

<!-- Animation -->
<a-entity animation="property: rotation; to: 0 360 0; loop: true; dur: 8000"></a-entity>

<!-- Position, Rotation, Scale -->
<a-entity position="0 1 -3" rotation="0 45 0" scale="2 2 2"></a-entity>
```

#### 2.2.2 AR.js
**버전**: 최신 (master branch)  
**CDN**: `https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js`

**마커 타입**:
1. **Preset Markers**: `hiro`, `kanji`
2. **Pattern Markers**: 커스텀 `.patt` 파일
3. **Barcode Markers**: 3x3, 4x4 매트릭스

**설정 옵션**:
```html
<a-scene
  embedded
  arjs="sourceType: webcam; 
        debugUIEnabled: false; 
        detectionMode: mono_and_matrix; 
        matrixCodeType: 3x3;"
  vr-mode-ui="enabled: false"
  renderer="logarithmicDepthBuffer: true; precision: medium;">
</a-scene>
```

**마커 이벤트**:
```javascript
marker.addEventListener('markerFound', () => {
  console.log('Marker detected');
});

marker.addEventListener('markerLost', () => {
  console.log('Marker lost');
});
```

### 2.3 외부 라이브러리

#### 2.3.1 Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### 2.3.2 선택적 라이브러리
- **Chart.js**: 통계 그래프 (선택)
- **Howler.js**: 사운드 관리 (선택)
- **GSAP**: 고급 애니메이션 (선택)

---

## 3. 코드 구조 및 패턴

### 3.1 파일 구조 규칙

#### 3.1.1 네이밍 규칙

**파일명**:
- HTML: `kebab-case.html` (예: `ar-marker.html`)
- CSS: `kebab-case.css` (예: `ar-ui.css`)
- JavaScript: `kebab-case.js` (예: `geometry-shapes.js`)
- JSON: `kebab-case.json` (예: `quiz-questions.json`)

**변수명**:
```javascript
// camelCase (일반 변수, 함수)
const userName = 'John';
function getUserData() {}

// PascalCase (클래스, 생성자)
class ARMarkerController {}
const controller = new ARMarkerController();

// UPPER_SNAKE_CASE (상수)
const MAX_LEVEL = 7;
const API_URL = 'https://api.example.com';

// kebab-case (CSS 클래스, ID)
.ar-overlay {}
#shape-info {}
```

#### 3.1.2 코드 스타일

**들여쓰기**: 2 spaces  
**세미콜론**: 사용  
**따옴표**: Single quotes (`'`)  
**줄 길이**: 최대 100자

**예시**:
```javascript
/**
 * 도형 생성 함수
 * @param {Object} config - 도형 설정
 * @returns {HTMLElement} A-Frame 엔티티
 */
function createShape(config) {
  const { type, color, size } = config;
  
  if (!type) {
    throw new Error('Shape type is required');
  }
  
  const entity = document.createElement('a-entity');
  entity.setAttribute('geometry', {
    primitive: type,
    width: size,
    height: size
  });
  
  return entity;
}
```

### 3.2 디자인 패턴

#### 3.2.1 Module Pattern
```javascript
const ShapeModule = (function() {
  // Private
  let shapes = [];
  
  function addShape(shape) {
    shapes.push(shape);
  }
  
  // Public
  return {
    create: function(config) {
      const shape = createShape(config);
      addShape(shape);
      return shape;
    },
    getAll: function() {
      return shapes.slice(); // 복사본 반환
    }
  };
})();
```

#### 3.2.2 Class Pattern
```javascript
class ARController {
  constructor() {
    this.scene = null;
    this.markers = {};
    this.isInitialized = false;
  }
  
  async init() {
    // 초기화 로직
  }
  
  registerMarker(markerId) {
    // 마커 등록
  }
  
  // Private method (convention)
  _handleMarkerFound(markerId) {
    // 내부 처리
  }
}
```

#### 3.2.3 Observer Pattern
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }
}

// 사용
const emitter = new EventEmitter();
emitter.on('levelComplete', (data) => {
  console.log('Level completed:', data);
});
emitter.emit('levelComplete', { level: 1, score: 95 });
```

### 3.3 에러 처리

#### 3.3.1 Try-Catch
```javascript
async function loadData() {
  try {
    const response = await fetch('data/levels.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load data:', error);
    // 사용자에게 에러 표시
    showError('데이터를 불러올 수 없습니다.');
    // 기본값 반환
    return getDefaultData();
  }
}
```

#### 3.3.2 에러 로깅
```javascript
function logError(error, context = {}) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context: context,
    userAgent: navigator.userAgent
  };
  
  console.error('Error:', errorInfo);
  
  // 선택: 에러 추적 서비스로 전송
  // sendToErrorTracking(errorInfo);
}
```

### 3.4 상태 관리

#### 3.4.1 LocalStorage 헬퍼
```javascript
const Storage = {
  prefix: 'math-ar-',
  
  set(key, value) {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.prefix + key, serialized);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Storage get error:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },
  
  clear() {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }
};
```

---

## 4. API 명세

### 4.1 GeometryShapes API

#### 4.1.1 create()
```javascript
/**
 * 도형 생성
 * @param {Object} config - 도형 설정
 * @param {string} config.type - 도형 타입 (triangle, square, cube 등)
 * @param {string} [config.color='#4A90E2'] - 색상 (hex)
 * @param {number} [config.size=1] - 크기
 * @param {boolean} [config.animation=true] - 애니메이션 여부
 * @param {Object} [config.position={x:0,y:0,z:0}] - 위치
 * @param {Object} [config.rotation={x:0,y:0,z:0}] - 회전
 * @returns {HTMLElement|null} A-Frame 엔티티 또는 null
 * @example
 * const triangle = GeometryShapes.create({
 *   type: 'triangle',
 *   color: '#FF6B6B',
 *   size: 1.5,
 *   animation: true
 * });
 */
static create(config) { }
```

#### 4.1.2 getShapeInfo()
```javascript
/**
 * 도형 정보 조회
 * @param {string} type - 도형 타입
 * @returns {Object|null} 도형 정보 객체
 * @example
 * const info = GeometryShapes.getShapeInfo('triangle');
 * // { name: '삼각형', sides: 3, vertices: 3, ... }
 */
static getShapeInfo(type) { }
```

### 4.2 ARMarkerController API

#### 4.2.1 init()
```javascript
/**
 * AR 컨트롤러 초기화
 * @param {number} [levelId=1] - 레벨 ID
 * @returns {Promise<void>}
 * @throws {Error} 초기화 실패 시
 * @example
 * const controller = new ARMarkerController();
 * await controller.init(1);
 */
async init(levelId = 1) { }
```

#### 4.2.2 registerMarkers()
```javascript
/**
 * 마커 등록
 * @private
 * @returns {void}
 */
registerMarkers() { }
```

### 4.3 ProgressTracker API

#### 4.3.1 saveProgress()
```javascript
/**
 * 진행도 저장
 * @param {number} levelId - 레벨 ID
 * @param {Object} data - 저장할 데이터
 * @param {number} data.score - 점수
 * @param {number} data.stars - 별점 (0-3)
 * @param {number} data.time - 소요 시간 (초)
 * @returns {boolean} 저장 성공 여부
 * @example
 * ProgressTracker.saveProgress(1, {
 *   score: 95,
 *   stars: 3,
 *   time: 180
 * });
 */
static saveProgress(levelId, data) { }
```

---

## 5. 성능 최적화

### 5.1 이미지 최적화

#### 5.1.1 포맷 선택
- **WebP**: 최우선 (Chrome, Edge, Firefox 지원)
- **PNG**: 투명도 필요 시
- **JPEG**: 사진, 복잡한 이미지

#### 5.1.2 압축
```bash
# ImageOptim (macOS)
# TinyPNG (온라인)
# Squoosh (온라인)

# 목표 크기
- 아이콘: < 10KB
- 캐릭터: < 50KB
- 배경: < 100KB
```

#### 5.1.3 레이지 로딩
```html
<img src="image.jpg" loading="lazy" alt="Description">
```

### 5.2 JavaScript 최적화

#### 5.2.1 코드 분할
```javascript
// 필요할 때만 로드
async function loadMinigame() {
  const { Minigame } = await import('./minigames.js');
  return new Minigame();
}
```

#### 5.2.2 디바운싱
```javascript
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

// 사용
window.addEventListener('resize', debounce(() => {
  console.log('Resized');
}, 250));
```

#### 5.2.3 쓰로틀링
```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
```

### 5.3 CSS 최적화

#### 5.3.1 Critical CSS
```html
<!-- 인라인 중요 CSS -->
<style>
  /* 초기 렌더링에 필요한 CSS만 */
  body { margin: 0; font-family: sans-serif; }
  .loading { display: flex; justify-content: center; }
</style>

<!-- 나머지 CSS는 비동기 로드 -->
<link rel="preload" href="style.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

#### 5.3.2 미사용 CSS 제거
```bash
# PurgeCSS 사용 (선택)
npm install -g purgecss
purgecss --css style.css --content *.html --output dist/
```

### 5.4 AR 최적화

#### 5.4.1 폴리곤 수 감소
```javascript
// 낮은 폴리곤 모델 사용
<a-sphere radius="0.5" segments-width="16" segments-height="12"></a-sphere>
// 기본값: 32x24 → 16x12로 감소
```

#### 5.4.2 텍스처 최적화
```javascript
// 텍스처 크기 제한
- 최대: 1024x1024
- 권장: 512x512
- 2의 제곱수 사용 (256, 512, 1024)
```

---

## 6. 보안 구현

### 6.1 XSS 방지

#### 6.1.1 입력 검증
```javascript
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// 사용
const userInput = '<script>alert("XSS")</script>';
const safe = sanitizeInput(userInput);
// 결과: &lt;script&gt;alert("XSS")&lt;/script&gt;
```

#### 6.1.2 innerHTML 대신 textContent
```javascript
// 나쁜 예
element.innerHTML = userInput;

// 좋은 예
element.textContent = userInput;
```

### 6.2 Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://aframe.io https://raw.githack.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src https://fonts.gstatic.com;">
```

### 6.3 HTTPS 강제

```javascript
// HTTP → HTTPS 리다이렉트
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

---

## 7. 테스트 전략

### 7.1 수동 테스트

#### 7.1.1 기능 테스트 체크리스트

**AR 기능**:
- [ ] 마커 인식 (Hiro, Kanji)
- [ ] 도형 표시 (3초 이내)
- [ ] 도형 회전 애니메이션
- [ ] 마커 손실 시 도형 숨김
- [ ] 도형 정보 패널 표시

**퀴즈 기능**:
- [ ] 문제 로드
- [ ] 정답 체크
- [ ] 점수 계산
- [ ] 진행도 저장

**진행도**:
- [ ] LocalStorage 저장
- [ ] 데이터 로드
- [ ] 통계 표시

#### 7.1.2 크로스 브라우저 테스트

| 브라우저 | 버전 | 테스트 항목 | 상태 |
|---------|------|-----------|------|
| Chrome | 90+ | 전체 기능 | ⏳ |
| Safari | 14+ | AR, 퀴즈 | ⏳ |
| Edge | 90+ | 전체 기능 | ⏳ |
| Firefox | 88+ | 퀴즈, 진행도 | ⏳ |

### 7.2 자동화 테스트 (선택)

#### 7.2.1 단위 테스트 (Jest)
```javascript
// geometry-shapes.test.js
describe('GeometryShapes', () => {
  test('creates triangle entity', () => {
    const triangle = GeometryShapes.create({ type: 'triangle' });
    expect(triangle).toBeTruthy();
    expect(triangle.tagName).toBe('A-ENTITY');
  });
  
  test('returns shape info', () => {
    const info = GeometryShapes.getShapeInfo('triangle');
    expect(info.name).toBe('삼각형');
    expect(info.sides).toBe(3);
  });
});
```

### 7.3 성능 테스트

#### 7.3.1 Lighthouse
```bash
# Chrome DevTools → Lighthouse
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 80
```

#### 7.3.2 WebPageTest
```
https://www.webpagetest.org/

측정 항목:
- First Contentful Paint < 1.5s
- Time to Interactive < 3.0s
- Total Blocking Time < 200ms
```

---

## 8. 배포 전략

### 8.1 GitHub Pages

#### 8.1.1 설정
```bash
# 1. gh-pages 브랜치 생성
git checkout -b gh-pages

# 2. 빌드 (필요시)
# 현재 프로젝트는 빌드 불필요

# 3. 푸시
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages

# 4. GitHub 설정
# Settings → Pages → Source: gh-pages branch
```

#### 8.1.2 커스텀 도메인 (선택)
```
# CNAME 파일 생성
echo "math-ar.example.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

### 8.2 Netlify

#### 8.2.1 netlify.toml
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

#### 8.2.2 배포
```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 배포
netlify deploy --prod
```

### 8.3 Vercel

#### 8.3.1 vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 8.4 환경별 설정

#### 8.4.1 개발 환경
```javascript
const config = {
  env: 'development',
  debug: true,
  apiUrl: 'http://localhost:8000'
};
```

#### 8.4.2 프로덕션 환경
```javascript
const config = {
  env: 'production',
  debug: false,
  apiUrl: 'https://math-ar.example.com'
};
```

---

## 9. 모니터링 및 로깅

### 9.1 에러 추적

#### 9.1.1 Sentry (선택)
```html
<script src="https://browser.sentry-cdn.com/7.0.0/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: 'YOUR_DSN',
    environment: 'production',
    release: 'math-ar@1.0.0'
  });
</script>
```

### 9.2 사용자 분석

#### 9.2.1 Google Analytics 4
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### 9.2.2 커스텀 이벤트
```javascript
// 레벨 완료 추적
function trackLevelComplete(levelId, score) {
  gtag('event', 'level_complete', {
    level_id: levelId,
    score: score,
    event_category: 'engagement'
  });
}
```

### 9.3 콘솔 로깅

#### 9.3.1 로그 레벨
```javascript
const Logger = {
  debug: (...args) => {
    if (config.debug) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  info: (...args) => {
    console.info('[INFO]', ...args);
  },
  
  warn: (...args) => {
    console.warn('[WARN]', ...args);
  },
  
  error: (...args) => {
    console.error('[ERROR]', ...args);
  }
};
```

---

## 10. 유지보수 가이드

### 10.1 코드 리뷰 체크리스트

- [ ] 코드 스타일 준수
- [ ] JSDoc 주석 작성
- [ ] 에러 처리 구현
- [ ] 성능 고려
- [ ] 보안 검토
- [ ] 테스트 작성
- [ ] 문서 업데이트

### 10.2 버전 관리

#### 10.2.1 Semantic Versioning
```
MAJOR.MINOR.PATCH

1.0.0 → 1.0.1 (버그 수정)
1.0.1 → 1.1.0 (기능 추가)
1.1.0 → 2.0.0 (호환성 깨지는 변경)
```

### 10.3 문서 업데이트

- **코드 변경 시**: 관련 문서 즉시 업데이트
- **새 기능 추가**: API 문서 추가
- **버그 수정**: CHANGELOG.md 업데이트

### 10.4 백업 전략

```bash
# Git 태그로 버전 백업
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 정기 백업 (주 1회)
git push --all
git push --tags
```

---

## 11. 부록

### 11.1 유용한 도구

| 도구 | 용도 | URL |
|------|------|-----|
| Can I Use | 브라우저 호환성 | https://caniuse.com |
| Lighthouse | 성능 측정 | Chrome DevTools |
| WebPageTest | 성능 분석 | https://webpagetest.org |
| AR.js Marker Training | 마커 생성 | https://ar-js-org.github.io |
| TinyPNG | 이미지 압축 | https://tinypng.com |
| Squoosh | 이미지 최적화 | https://squoosh.app |

### 11.2 참고 자료

- A-Frame 문서: https://aframe.io/docs/
- AR.js 문서: https://ar-js-org.github.io/AR.js-Docs/
- MDN Web Docs: https://developer.mozilla.org/
- Web.dev: https://web.dev/

### 11.3 변경 이력

| 버전 | 날짜 | 변경 내용 | 작성자 |
|------|------|----------|--------|
| 1.0 | 2026-05-18 | 최초 작성 | Cline AI |

---

**문서 승인**

- [ ] 기술 리더
- [ ] 개발자
- [ ] QA 엔지니어

**다음 검토일**: 2026년 6월 1일
