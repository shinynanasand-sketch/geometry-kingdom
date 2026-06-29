/**
 * AR 마커 기반 컨트롤러
 * AR Marker Controller
 */

class ARMarkerController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.markers = {};
    this.currentLevel = null;
    this.currentShape = null;
    this.isInitialized = false;
    this.levelData = null;
  }

  /**
   * 초기화
   */
  async init(levelId = 1) {
    try {
      console.log('AR Marker Controller initializing...');

      // 레벨 데이터 로드
      await this.loadLevelData(levelId);

      // A-Frame 씬이 로드될 때까지 대기
      await this.waitForScene();

      // 씬 및 카메라 가져오기
      this.scene = document.querySelector('a-scene');
      this.camera = document.querySelector('[camera]');

      if (!this.scene) {
        throw new Error('A-Frame scene not found');
      }

      // 마커 등록
      this.registerMarkers();

      // 이벤트 리스너 설정
      this.setupEventListeners();

      // UI 초기화
      this.initUI();

      this.isInitialized = true;
      console.log('AR Marker Controller initialized successfully');

      // 환영 메시지 표시
      this.showWelcomeMessage();

    } catch (error) {
      console.error('AR initialization failed:', error);
      this.showError('AR 초기화에 실패했습니다. 페이지를 새로고침해주세요.');
    }
  }

  /**
   * A-Frame 씬 로드 대기
   */
  waitForScene() {
    return new Promise((resolve) => {
      const scene = document.querySelector('a-scene');
      if (scene && scene.hasLoaded) {
        resolve();
      } else {
        document.addEventListener('DOMContentLoaded', () => {
          const sceneEl = document.querySelector('a-scene');
          if (sceneEl) {
            sceneEl.addEventListener('loaded', () => {
              resolve();
            });
          } else {
            resolve();
          }
        });
      }
    });
  }

  /**
   * 레벨 데이터 로드
   */
  async loadLevelData(levelId) {
    const urlParams = new URLSearchParams(window.location.search);
    const level = parseInt(urlParams.get('level') || levelId, 10);
    this.currentLevel = level;

    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      this.levelData = data.levels.find((l) => l.id === level) || this.getDefaultLevelData(level);
      console.log('Level data loaded:', this.levelData);
    } catch (error) {
      console.error('Failed to load level data:', error);
      this.levelData = this.getDefaultLevelData(level);
    }
  }

  /**
   * 기본 레벨 데이터 (임시)
   */
  getDefaultLevelData(levelId) {
    const levels = {
      1: {
        id: 1,
        name: '평면 도형 기초',
        shapes: [
          { type: 'triangle', color: '#FF6B6B', marker: 'hiro' },
          { type: 'square', color: '#4A90E2', marker: 'kanji' },
          { type: 'circle', color: '#FFD43B', marker: 'letterA' }
        ]
      },
      2: {
        id: 2,
        name: '평면 도형 심화',
        shapes: [
          { type: 'square', color: '#4A90E2', marker: 'hiro' },
          { type: 'rectangle', color: '#51CF66', marker: 'kanji' },
          { type: 'triangle', color: '#FF6B6B', marker: 'letterA' }
        ]
      }
    };

    return levels[levelId] || levels[1];
  }

  /**
   * 마커 등록
   */
  registerMarkers() {
    const markerElements = document.querySelectorAll('a-marker');

    if (markerElements.length === 0) {
      console.warn('No markers found in the scene');
      return;
    }

    const shapeByMarker = {};
    if (this.levelData?.shapes) {
      this.levelData.shapes.forEach((shape) => {
        shapeByMarker[shape.marker] = shape;
      });
    }

    markerElements.forEach((marker, index) => {
      const markerId = marker.getAttribute('id') || `marker-${index}`;
      const preset = marker.getAttribute('preset');
      const markerKey = preset || markerId.replace(/^marker-/, '');

      const shapeData = shapeByMarker[markerKey];
      if (!shapeData) {
        console.warn(`No shape data for marker: ${markerKey}`);
        return;
      }

      this.markers[markerId] = {
        element: marker,
        type: preset || marker.getAttribute('type'),
        isVisible: false,
        shape: null,
        shapeData
      };

      marker.addEventListener('markerFound', () => {
        this.onMarkerFound(markerId);
      });

      marker.addEventListener('markerLost', () => {
        this.onMarkerLost(markerId);
      });

      console.log(`Marker registered: ${markerId} (${markerKey})`);
    });
  }

  /**
   * 마커 감지 시
   */
  onMarkerFound(markerId) {
    console.log(`Marker found: ${markerId}`);
    
    const marker = this.markers[markerId];
    if (!marker) return;

    marker.isVisible = true;

    // 도형 표시
    this.showShape(markerId);

    // UI 업데이트
    this.updateUI(markerId, true);
    this.updateMarkerStatus(markerId, true);

    // 효과음 재생 (나중에 구현)
    // SoundManager.play('marker-found');
  }

  /**
   * 마커 사라질 때
   */
  onMarkerLost(markerId) {
    console.log(`Marker lost: ${markerId}`);
    
    const marker = this.markers[markerId];
    if (!marker) return;

    marker.isVisible = false;

    // UI 업데이트
    this.updateUI(markerId, false);
    this.updateMarkerStatus(markerId, false);
  }

  /**
   * 도형 표시
   */
  showShape(markerId) {
    const marker = this.markers[markerId];
    if (!marker) return;

    // 이미 도형이 있으면 제거
    if (marker.shape) {
      marker.element.removeChild(marker.shape);
    }

    // 새 도형 생성
    const shapeData = marker.shapeData;
    marker.shape = GeometryShapes.create({
      type: shapeData.type,
      color: shapeData.color,
      size: 1,
      animation: true,
      position: { x: 0, y: 0.5, z: 0 }
    });

    if (marker.shape) {
      // 마커에 추가
      marker.element.appendChild(marker.shape);

      // 라벨 추가
      const info = GeometryShapes.getShapeInfo(shapeData.type);
      if (info) {
        GeometryShapes.addLabel(marker.shape, info.name, { x: 0, y: 1.5, z: 0 });
      }

      this.currentShape = marker.shape;
    }
  }

  /**
   * 마커 상태 표시 업데이트
   */
  updateMarkerStatus(markerId, isVisible) {
    const status = document.getElementById('marker-status');
    if (!status) return;

    if (isVisible) {
      const marker = this.markers[markerId];
      const info = GeometryShapes.getShapeInfo(marker?.shapeData?.type);
      status.innerHTML = `<p>✅ ${info?.name || '도형'} 마커 감지됨!</p>`;
    } else {
      const anyVisible = Object.values(this.markers).some((m) => m.isVisible);
      if (!anyVisible) {
        status.innerHTML = '<p>📷 마커를 찾는 중...</p>';
      }
    }
  }

  /**
   * UI 업데이트
   */
  updateUI(markerId, isVisible) {
    const infoPanel = document.getElementById('shape-info');
    if (!infoPanel) return;

    if (isVisible) {
      const marker = this.markers[markerId];
      const shapeData = marker.shapeData;
      const info = GeometryShapes.getShapeInfo(shapeData.type);

      if (info) {
        infoPanel.innerHTML = `
          <div class="shape-info-content">
            <h2>${info.name}</h2>
            <p class="shape-name-en">${info.nameEn}</p>
            <div class="shape-properties">
              ${info.sides !== undefined ? `<p>변: ${info.sides}개</p>` : ''}
              ${info.vertices !== undefined ? `<p>꼭짓점: ${info.vertices}개</p>` : ''}
              ${info.faces !== undefined ? `<p>면: ${info.faces}개</p>` : ''}
              ${info.edges !== undefined ? `<p>모서리: ${info.edges}개</p>` : ''}
            </div>
            <p class="shape-description">${info.description}</p>
          </div>
        `;
        infoPanel.classList.add('visible');
      }
    } else {
      // 다른 마커가 보이는지 확인
      const anyVisible = Object.values(this.markers).some(m => m.isVisible);
      if (!anyVisible) {
        infoPanel.classList.remove('visible');
      }
    }
  }

  /**
   * UI 초기화
   */
  initUI() {
    // 레벨 정보 표시
    const levelTitle = document.getElementById('level-title');
    if (levelTitle && this.levelData) {
      levelTitle.textContent = this.levelData.name;
    }

    // 뒤로 가기 버튼
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
      });
    }

    // 힌트 버튼
    const hintBtn = document.getElementById('hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        this.showHint();
      });
    }

    // 퀴즈 시작 버튼
    const quizBtn = document.getElementById('quiz-btn');
    if (quizBtn) {
      quizBtn.addEventListener('click', () => {
        this.startQuiz();
      });
    }

    const rotateBtn = document.getElementById('btn-rotate');
    if (rotateBtn) {
      rotateBtn.addEventListener('click', () => {
        this.toggleRotation();
      });
    }
  }

  /**
   * 도형 회전 토글
   */
  toggleRotation() {
    if (!this.currentShape) return;

    const current = this.currentShape.getAttribute('animation');
    if (current) {
      this.currentShape.removeAttribute('animation');
    } else {
      this.currentShape.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 5000,
        easing: 'linear'
      });
    }
  }

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 씬 클릭 이벤트
    if (this.scene) {
      this.scene.addEventListener('click', (e) => {
        this.onSceneClick(e);
      });
    }

    // 카메라 권한 에러 처리
    window.addEventListener('arjs-video-loaded', () => {
      console.log('AR camera loaded');
    });

    window.addEventListener('camera-error', (error) => {
      console.error('Camera error:', error);
      this.showError('카메라 접근에 실패했습니다. 카메라 권한을 확인해주세요.');
    });
  }

  /**
   * 씬 클릭 시
   */
  onSceneClick(event) {
    // 도형 클릭 감지 및 인터랙션
    const intersectedEl = event.detail.intersection?.object.el;
    if (intersectedEl) {
      console.log('Clicked on:', intersectedEl);
      // 클릭 효과 추가 가능
    }
  }

  /**
   * 환영 메시지 표시
   */
  showWelcomeMessage() {
    const message = document.getElementById('welcome-message');
    if (message) {
      message.classList.add('visible');
      setTimeout(() => {
        message.classList.remove('visible');
      }, 3000);
    }
  }

  /**
   * 힌트 표시
   */
  showHint() {
    const hint = document.getElementById('hint-panel');
    if (hint) {
      hint.innerHTML = `
        <div class="hint-content">
          <h3>💡 힌트</h3>
          <p>마커를 카메라에 비춰보세요!</p>
          <p>도형이 나타나면 천천히 관찰해보세요.</p>
          <button onclick="document.getElementById('hint-panel').classList.remove('visible')">닫기</button>
        </div>
      `;
      hint.classList.add('visible');
    }
  }

  /**
   * 퀴즈 시작
   */
  startQuiz() {
    window.location.href = `quiz.html?level=${this.currentLevel}`;
  }

  /**
   * 에러 표시
   */
  showError(message) {
    const errorPanel = document.getElementById('error-panel');
    if (errorPanel) {
      errorPanel.innerHTML = `
        <div class="error-content">
          <h3>⚠️ 오류</h3>
          <p>${message}</p>
          <button onclick="location.reload()">새로고침</button>
        </div>
      `;
      errorPanel.classList.add('visible');
    } else {
      alert(message);
    }
  }

  /**
   * 도형 변경
   */
  changeShape(markerId, newShapeType) {
    const marker = this.markers[markerId];
    if (!marker) return;

    marker.shapeData.type = newShapeType;
    this.showShape(markerId);
  }

  /**
   * 정리
   */
  destroy() {
    // 이벤트 리스너 제거
    Object.values(this.markers).forEach(marker => {
      if (marker.element) {
        marker.element.removeEventListener('markerFound', this.onMarkerFound);
        marker.element.removeEventListener('markerLost', this.onMarkerLost);
      }
    });

    this.markers = {};
    this.isInitialized = false;
  }
}

// 전역 인스턴스
let arController = null;

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
  // URL 파라미터에서 레벨 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const level = parseInt(urlParams.get('level')) || 1;

  // AR 컨트롤러 초기화
  arController = new ARMarkerController();
  window.arController = arController;
  arController.init(level);
});

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARMarkerController;
}
