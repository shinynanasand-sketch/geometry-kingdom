/**
 * AR 마커 기반 컨트롤러
 * AR Marker Controller
 */

const MARKER_SHAPE_ICONS = {
  triangle: '🔺',
  rightTriangle: '📐',
  isoscelesTriangle: '🔺',
  quad: '⬜',
  square: '🟦',
  rectangle: '🟩',
  rhombus: '◆',
  parallelogram: '▰',
  trapezoid: '⏢',
  circle: '⭕',
  cube: '🧊'
};

class ARMarkerController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.markers = {};
    this.currentLevel = null;
    this.currentShape = null;
    this.isInitialized = false;
    this.levelData = null;
    this.previewMode = false;
    this.cameraReady = false;
    this.placementReady = false;
    this.shapes = [];
    this.shapesContainer = null;
    this.selectedShapeType = 'triangle';
    this.selectedShapeColor = '#FF6B6B';
    this.rotationEnabled = false;
    this.highlightMode = 'none';
    this.highlightModes = ['none', 'faces', 'edges', 'vertices'];
    this.currentShapeRecord = null;
    this.simMarkerIndex = 0;
    this.cameraMode = false;
  }

  isCameraMode() {
    return window.__AR_CAMERA_MODE__ === true ||
      new URLSearchParams(window.location.search).get('mode') === 'camera';
  }

  /**
   * 초기화 — 기본은 3D, mode=camera 만 카메라/마커
   */
  async init(levelId = 1) {
    try {
      this.cameraMode = this.isCameraMode();
      console.log('AR Marker Controller initializing...', this.cameraMode ? 'camera' : '3d');

      await this.loadLevelData(levelId);
      await this.waitForScene();

      this.scene = document.querySelector('a-scene');
      this.camera = document.querySelector('#main-camera') || document.querySelector('[camera]');
      this.shapesContainer = document.getElementById('shapes-container');

      if (!this.scene) {
        throw new Error('A-Frame scene not found');
      }

      this.initUI();
      this.setupModeToggleButton();

      if (this.cameraMode) {
        this.registerMarkers();
        this.setupCameraModeUI();
        this.setupCameraAutoFallback();
      } else {
        this.enablePreviewMode('카메라 없이 3D로 시작합니다');
      }

      this.isInitialized = true;
      console.log('AR Marker Controller ready');
    } catch (error) {
      console.error('AR initialization failed:', error);
      this.showError('초기화에 실패했습니다. 페이지를 새로고침해주세요.');
    }
  }

  /**
   * A-Frame 씬 로드 대기
   */
  waitForScene() {
    return new Promise((resolve) => {
      const scene = document.querySelector('a-scene');
      if (!scene) {
        resolve();
        return;
      }
      if (scene.hasLoaded) {
        resolve();
        return;
      }
      const done = () => resolve();
      scene.addEventListener('loaded', done, { once: true });
      setTimeout(done, 4000);
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
          { type: 'triangle', color: '#FF6B6B', marker: 'hiro', name: '삼각형' },
          { type: 'quad', color: '#4A90E2', marker: 'kanji', name: '사각형' },
          { type: 'circle', color: '#FFD43B', marker: 'letterA', name: '원' }
        ]
      },
      2: {
        id: 2,
        name: '평면 도형 심화',
        shapes: [
          { type: 'square', color: '#4A90E2', marker: 'hiro', name: '정사각형' },
          { type: 'rectangle', color: '#51CF66', marker: 'kanji', name: '직사각형' },
          { type: 'rhombus', color: '#845EF7', marker: 'letterA', name: '마름모' },
          { type: 'parallelogram', color: '#20C997', marker: 'hiro', name: '평행사변형' },
          { type: 'trapezoid', color: '#FF922B', marker: 'kanji', name: '사다리꼴' },
          { type: 'rightTriangle', color: '#FF8787', marker: 'letterA', name: '직각삼각형' },
          { type: 'isoscelesTriangle', color: '#FFA8A8', marker: 'hiro', name: '이등변삼각형' }
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

      const shapeData = shapeByMarker[markerKey] || {
        type: 'square',
        color: '#4A90E2',
        marker: markerKey,
        name: '도형'
      };

      if (!shapeByMarker[markerKey]) {
        console.warn(`No shape data for marker: ${markerKey}, using default`);
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
      this.selectedShapeType = shapeData.type;
      if (window.ARShapeControls) {
        ARShapeControls.updateInfo(shapeData.type);
      }
      this.showShapeControls(true);
    }
  }

  /**
   * 마커 상태 표시 업데이트
   */
  updateMarkerStatus(markerId, isVisible) {
    const status = document.getElementById('marker-status');
    if (!status) return;

    status.style.display = 'block';

    if (isVisible) {
      const marker = this.markers[markerId];
      const info = GeometryShapes.getShapeInfo(marker?.shapeData?.type);
      status.innerHTML = `<p>✅ ${info?.name || '도형'} 마커 감지됨!</p>`;
      status.classList.add('found');
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    } else {
      const anyVisible = Object.values(this.markers).some((m) => m.isVisible);
      if (!anyVisible) {
        status.innerHTML = '<p>📷 마커를 찾는 중... (탭하면 닫기)</p>';
        status.classList.remove('found');
      }
    }
  }

  /**
   * UI 업데이트
   */
  updateUI(markerId, isVisible) {
    if (!isVisible) {
      const anyVisible = Object.values(this.markers).some((m) => m.isVisible);
      if (!anyVisible) {
        this.showShapeControls(false);
        if (!this.previewMode) {
          ARShapeControls?.hideInfoPanel();
        }
      }
      return;
    }

    const marker = this.markers[markerId];
    const shapeData = marker?.shapeData;
    if (!shapeData) return;

    this.selectedShapeType = shapeData.type;
    this.currentShape = marker.shape || this.currentShape;
    this.updateShapeInfo(shapeData.type);
    this.showShapeControls(true);
  }

  showShapeControls(show) {
    const ids = [
      'scale-controls',
      'btn-scale-up',
      'btn-scale-down',
      'btn-highlight',
      'btn-delete',
      'btn-info'
    ];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (this.previewMode && el.classList.contains('marker-3d-only')) {
        return;
      }
      const isGroup = id === 'scale-controls';
      el.style.display = show ? (isGroup ? 'flex' : 'flex') : 'none';
    });
  }

  /**
   * UI 초기화
   */
  initUI() {
    const levelTitle = document.getElementById('level-title');
    if (levelTitle && this.levelData) {
      levelTitle.textContent = `레벨 ${this.levelData.id}: ${this.levelData.name}`;
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

    // 회전 버튼은 HTML onclick="toggleRotation()" 만 사용 (이중 호출 방지)
  }

  setupCameraModeUI() {
    const statusEl = document.getElementById('marker-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.onclick = () => { statusEl.style.display = 'none'; };
      statusEl.innerHTML = `
        <p>📷 카메라 테스트 모드</p>
        <p class="hint">마커를 비추거나 「마커 시뮬레이션」을 누르세요</p>
      `;
    }

    const desc = document.getElementById('level-desc');
    if (desc) {
      desc.textContent = '카메라 테스트 — 시뮬레이션 또는 화면 마커 사용';
    }

    const toggleBtn = document.getElementById('mode-toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = '🖥️ 3D로 돌아가기';
      toggleBtn.classList.add('active');
    }

    this.buildSimButtons();
    this.showShapeControls(true);
  }

  buildSimButtons() {
    const panel = document.getElementById('camera-test-panel');
    if (!panel || !this.levelData?.shapes) return;

    // 기존 시뮬 버튼 뒤에 도형별 버튼 추가
    const existing = panel.querySelectorAll('.sim-shape-btn');
    existing.forEach((el) => el.remove());

    this.levelData.shapes.forEach((shape) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sim-btn sim-shape-btn';
      const name = shape.name || GeometryShapes.getShapeInfo(shape.type)?.name || shape.type;
      btn.textContent = `${MARKER_SHAPE_ICONS[shape.type] || '📐'} ${name}`;
      btn.addEventListener('click', () => this.simulateMarker(shape.marker));
      panel.appendChild(btn);
    });
  }

  /**
   * 인쇄 마커 없이 인식 성공과 동일한 UI/도형 표시
   * (마커 트래킹 없이 카메라 앞에 도형을 띄움)
   */
  simulateMarker(markerKey) {
    const shapes = this.levelData?.shapes || [];
    let shapeData = shapes.find((s) => s.marker === markerKey);
    if (!shapeData && shapes.length) {
      shapeData = shapes[this.simMarkerIndex % shapes.length];
    }
    if (!shapeData) {
      this.showToast('시뮬레이션할 도형이 없습니다');
      return;
    }
    this.showSimulatedShape(shapeData);
  }

  simulateNextMarker() {
    const shapes = this.levelData?.shapes || [];
    if (!shapes.length) return;
    const shape = shapes[this.simMarkerIndex % shapes.length];
    this.simMarkerIndex += 1;
    this.simulateMarker(shape.marker);
  }

  showSimulatedShape(shapeData) {
    // 카메라 모드에서 마커 앵커 대신 카메라 앞 고정 위치에 표시
    let host = document.getElementById('sim-shape-host');
    if (!host) {
      host = document.createElement('a-entity');
      host.id = 'sim-shape-host';
      host.setAttribute('position', '0 0 -2');
      this.scene.appendChild(host);
    }
    while (host.firstChild) host.removeChild(host.firstChild);

    const shape = GeometryShapes.create({
      type: shapeData.type,
      color: shapeData.color,
      size: 1,
      animation: true,
      position: { x: 0, y: 0, z: 0 }
    });
    if (!shape) return;

    host.appendChild(shape);
    const info = GeometryShapes.getShapeInfo(shapeData.type);
    if (info) GeometryShapes.addLabel(shape, info.name, { x: 0, y: 1.2, z: 0 });

    this.currentShape = shape;
    this.selectedShapeType = shapeData.type;
    this.selectedShapeColor = shapeData.color;
    ARShapeControls?.updateInfo(shapeData.type);
    this.showShapeControls(true);
    this.showToast(`${info?.name || shapeData.type} 시뮬레이션`);
  }

  /**
   * 카메라 모드에서만: 카메라 실패 시 시뮬레이션 안내 (3D로 강제 이동하지 않음)
   */
  setupCameraAutoFallback() {
    if (!this.cameraMode) return;

    const statusEl = document.getElementById('marker-status');

    const onCameraReady = () => {
      this.cameraReady = true;
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = `
          <p>📷 카메라 준비 완료!</p>
          <p class="hint">마커를 비추거나 시뮬레이션 / 화면 마커를 사용하세요</p>
        `;
      }
    };

    const onFallback = () => {
      this.cameraReady = false;
      if (statusEl) {
        statusEl.style.display = 'block';
        statusEl.innerHTML = `
          <p>📷 카메라를 사용할 수 없습니다</p>
          <p class="hint">「마커 시뮬레이션」으로 UI를 테스트하세요</p>
        `;
      }
      this.showToast('카메라 없이 시뮬레이션으로 테스트할 수 있습니다');
    };

    if (window.AR3DHelper?.setupCameraAutoFallback) {
      AR3DHelper.setupCameraAutoFallback({
        timeoutMs: 4000,
        onCameraReady,
        onFallback
      });
    }
  }

  setupModeToggleButton() {
    const btn = document.getElementById('mode-toggle-btn');
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';

    const level = this.currentLevel || 1;
    if (this.cameraMode) {
      btn.textContent = '🖥️ 3D로 돌아가기';
      btn.addEventListener('click', () => {
        window.location.href = `ar-marker.html?level=${level}`;
      });
    } else {
      btn.textContent = '📷 카메라 ON (테스트)';
      btn.addEventListener('click', () => {
        window.location.href = `ar-marker.html?level=${level}&mode=camera`;
      });
    }
  }

  enablePreviewMode(message) {
    if (this.previewMode) return;
    this.previewMode = true;
    this.cameraMode = false;

    this.shapesContainer = document.getElementById('shapes-container');
    const groundAnchor = document.getElementById('ground-anchor');

    document.querySelectorAll('a-marker').forEach((m) => {
      m.setAttribute('visible', 'false');
    });
    if (groundAnchor) {
      groundAnchor.setAttribute('visible', 'true');
      groundAnchor.setAttribute('position', '0 0 0');
    }

    if (window.AR3DHelper) {
      AR3DHelper.enable3DScene(this.scene);
      AR3DHelper.setupFixedGround(groundAnchor, document.getElementById('ground-plane'));
    }

    const selector = document.getElementById('shape-selector');
    const placeBtn = document.getElementById('btn-place');
    if (selector) selector.style.display = 'block';
    if (placeBtn) placeBtn.style.display = 'block';

    const btn = document.getElementById('mode-toggle-btn');
    if (btn) {
      btn.classList.remove('active');
      btn.textContent = '📷 카메라 ON (테스트)';
    }

    const desc = document.getElementById('level-desc');
    if (desc) desc.textContent = '3D 모드 — 도형 선택 후 📍 도형 놓기';

    this.buildShapeSelector();
    if (this.levelData?.shapes?.[0]) {
      const s = this.levelData.shapes[0];
      this.selectShape(s.type, s.color);
    }

    const status = document.getElementById('marker-status');
    if (status) status.style.display = 'none';

    this.show3dControls(true);

    this.placementReady = false;
    if (this.scene) this.scene.dataset.placementBound = '';
    this.setupPlacement();

    if (message) this.showToast(message);
  }

  show3dControls(show) {
    document.querySelectorAll('.marker-3d-only').forEach((el) => {
      if (el.classList.contains('control-btn') || el.classList.contains('scale-controls')) {
        el.style.display = show ? 'flex' : 'none';
      } else if (el.classList.contains('shape-selector')) {
        el.style.display = show ? 'block' : 'none';
      } else {
        el.style.display = show ? 'block' : 'none';
      }
    });
  }

  updateShapeInfo(shapeType) {
    if (!window.ARShapeControls) return;
    ARShapeControls.updateInfo(shapeType);
    const info = GeometryShapes.getShapeInfo(shapeType);
    const sidesRow = document.querySelector('.prop-sides');
    const facesRow = document.querySelector('.prop-faces');
    if (sidesRow && facesRow && info) {
      const is2d = info.sides !== undefined && info.faces === undefined;
      sidesRow.style.display = is2d ? 'block' : 'none';
      facesRow.style.display = is2d ? 'none' : 'block';
    }
  }

  toggleShapeInfo() {
    if (!this.currentShape) {
      const visibleMarker = Object.values(this.markers).find((m) => m.isVisible && m.shape);
      if (visibleMarker) {
        this.currentShape = visibleMarker.shape;
        this.selectedShapeType = visibleMarker.shapeData.type;
      }
    }
    if (!this.currentShape) {
      this.showToast('먼저 도형을 눌러 선택하세요');
      return;
    }
    this.updateShapeInfo(this.selectedShapeType);
    const panel = document.getElementById('shape-info');
    const isOpen = panel && (panel.classList.contains('visible') || panel.style.display === 'block');
    if (isOpen) {
      ARShapeControls.hideInfoPanel();
    } else {
      ARShapeControls.showInfoPanel();
    }
  }

  toggleRotation() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 놓거나 선택하세요');
      return;
    }
    if (!window.ARShapeControls) return;
    const on = ARShapeControls.toggleRotation(this);
    this.showToast(on ? '회전 모드 ON — 마우스로 드래그하세요' : '회전 모드 OFF');
  }

  scaleUp() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 눌러 선택하세요');
      return;
    }
    const value = ARShapeControls.scaleUp(this);
    if (value != null) this.showToast(`크기 + (${value})`);
  }

  scaleDown() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 눌러 선택하세요');
      return;
    }
    const value = ARShapeControls.scaleDown(this);
    if (value != null) this.showToast(`크기 − (${value})`);
  }

  toggleScale() {
    this.scaleUp();
  }

  toggleHighlight() {
    if (!this.currentShape) return;
    ARShapeControls.toggleHighlight(this);
  }

  deleteCurrentShape() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 눌러 선택하세요');
      return;
    }
    const name = GeometryShapes.getShapeInfo(this.selectedShapeType)?.name || '도형';

    if (this.previewMode) {
      ARShapeControls.deleteShape(this);
      this.showToast(`${name} 삭제했습니다`);
      return;
    }

    // 시뮬레이션 호스트에 있는 도형
    const simHost = document.getElementById('sim-shape-host');
    if (simHost && simHost.contains(this.currentShape)) {
      simHost.removeChild(this.currentShape);
      this.currentShape = null;
      ARShapeControls?.hideInfoPanel();
      this.showToast(`${name} 삭제했습니다`);
      return;
    }

    const markerEntry = Object.values(this.markers).find((m) => m.shape === this.currentShape);
    if (markerEntry?.element && markerEntry.shape) {
      markerEntry.element.removeChild(markerEntry.shape);
      markerEntry.shape = null;
      markerEntry.isVisible = false;
    }
    this.currentShape = null;
    ARShapeControls?.hideInfoPanel();
    this.showToast(`${name} 삭제했습니다`);
  }

  showToast(message) {
    document.querySelector('.toast')?.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
      background: rgba(0,0,0,0.8); color: #fff; padding: 12px 24px;
      border-radius: 24px; font-size: 14px; z-index: 10000;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  buildShapeSelector() {
    const container = document.getElementById('shape-buttons');
    const shapes = this.levelData?.shapes || [];
    if (!container || !shapes.length) return;

    container.innerHTML = '';
    shapes.forEach((shape) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shape-btn';
      btn.dataset.shape = shape.type;
      btn.innerHTML = `
        <span class="icon">${MARKER_SHAPE_ICONS[shape.type] || '📐'}</span>
        <span class="name">${shape.name || GeometryShapes.getShapeInfo(shape.type)?.name || shape.type}</span>
      `;
      btn.addEventListener('click', () => this.selectShape(shape.type, shape.color));
      container.appendChild(btn);
    });
  }

  selectShape(type, color) {
    this.selectedShapeType = type;
    if (color) this.selectedShapeColor = color;
    document.querySelectorAll('.shape-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.shape === type);
    });
    this.updateShapeInfo(type);
  }

  setupPlacement() {
    if (!this.scene || this.placementReady) return;
    this.placementReady = true;

    window.selectShape = (type, color) => this.selectShape(type, color);
    window.scaleUp = () => this.scaleUp();
    window.scaleDown = () => this.scaleDown();
    window.toggleScale = () => this.scaleUp();

    if (!window.AR3DHelper) return;

    // 📍 버튼은 HTML onclick="placeShape()" 사용

    const canvas = this.scene.canvas || this.scene.querySelector('canvas');
    if (canvas) delete canvas.dataset.arPlacementBound;
    this.scene.dataset.placementBound = '';

    AR3DHelper.bindCanvasPlacement(this.scene, (pos) => {
      if (this.rotationEnabled) return;
      this.placeSelectedShapeAt(pos, false);
    }, {
      isBlocked: (target) => !!target?.closest?.(
        '.shape-btn, .control-btn, .btn-back, .modal, .preview-mode-btn, .place-shape-btn, .ar-header, #help-modal, .shape-info, .scale-controls, .camera-test-panel, #mode-toggle-btn'
      ),
      shapeCount: () => this.shapes.length,
      shapeType: () => this.selectedShapeType,
      shapeSize: () => 0.8,
      onSelectShape: (el) => {
        ARShapeControls?.selectShape(el, this);
        this.showShapeControls(true);
        this.showToast('도형을 선택했습니다. 🗑️로 삭제할 수 있어요');
      }
    });
  }

  placeSelectedShape() {
    if (this.rotationEnabled) {
      this.showToast('회전 모드에서는 도형을 놓을 수 없습니다. 🔄를 다시 누르세요');
      return;
    }
    if (!this.previewMode) this.enablePreviewMode();
    const pos = window.AR3DHelper
      ? AR3DHelper.getDefaultPlacePosition(this.shapes.length, this.selectedShapeType, 0.8)
      : { x: 0, y: 0.4, z: -0.5 };
    this.placeSelectedShapeAt(pos, true);
  }

  placeSelectedShapeAt(position, isLocal = false) {
    if (!this.shapesContainer) {
      this.shapesContainer = document.getElementById('shapes-container');
    }
    if (!this.shapesContainer) {
      this.showToast('화면을 불러오는 중입니다');
      return;
    }

    const size = 0.8;
    let localPos = position;
    if (!isLocal && window.AR3DHelper) {
      localPos = AR3DHelper.normalizePlacementPosition(
        this.scene, position, this.selectedShapeType, size
      );
    } else if (window.AR3DHelper) {
      localPos = {
        x: position.x,
        y: AR3DHelper.getShapeGroundY(this.selectedShapeType, size),
        z: position.z
      };
    }
    const rotation = window.AR3DHelper
      ? AR3DHelper.getPlacementRotation(this.selectedShapeType)
      : { x: 0, y: 0, z: 0 };

    const entity = GeometryShapes.create({
      type: this.selectedShapeType,
      color: this.selectedShapeColor,
      size,
      position: localPos,
      rotation,
      animation: false
    });
    if (!entity) return;

    entity.dataset.shapeType = this.selectedShapeType;
    entity.setAttribute('visible', 'true');
    this.shapesContainer.appendChild(entity);

    if (window.AR3DHelper) {
      AR3DHelper.markShapeClickable(entity);
    } else {
      entity.classList.add('placed-shape', 'clickable-shape');
      entity.setAttribute('class', 'placed-shape clickable-shape');
    }

    const record = { entity, type: this.selectedShapeType };
    this.shapes.push(record);

    if (window.ARShapeControls) {
      ARShapeControls.selectShape(entity, this);
    } else {
      this.currentShapeRecord = record;
      this.currentShape = entity;
    }

    const info = GeometryShapes.getShapeInfo(this.selectedShapeType);
    if (info) {
      GeometryShapes.addLabel(entity, info.name, { x: 0, y: 1.0, z: 0 });
    }
    this.showShapeControls(true);
    this.showToast(`${info?.name || '도형'}을(를) 배치했습니다!`);
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
  const urlParams = new URLSearchParams(window.location.search);
  const level = parseInt(urlParams.get('level'), 10) || 1;

  arController = new ARMarkerController();
  window.arController = arController;
  arController.init(level);
});

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARMarkerController;
}
