/**
 * AR Markerless Controller
 * 마커리스 AR - 레이캐스트 평면 배치, 레벨 3-4 기능
 */

const SHAPE_ICONS = {
  cube: '🧊',
  box: '📦',
  sphere: '⚪',
  cylinder: '🥫',
  cone: '🔺',
  pyramid: '🔻',
  prism: '⬡'
};

class ARMarkerlessController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.groundPlane = null;
    this.groundAnchor = null;
    this.shapesContainer = null;
    this.currentShape = null;
    this.currentShapeRecord = null;
    this.shapes = [];
    this.isPlaneDetected = false;
    this.isReady = false;
    this.selectedShapeType = 'cube';
    this.selectedShapeColor = '#845EF7';
    this.rotationEnabled = false;
    this.scaleMode = false;
    this.highlightMode = 'none';
    this.highlightModes = ['none', 'faces', 'edges', 'vertices'];
    this.isUnfolded = false;
    this.isCrossSection = false;
    this.levelData = null;
    this.currentLevel = 3;
    this.scaleGestureHandler = null;
    this.earlyInteractionReady = false;
    this.statusHideTimer = null;
    this.previewMode = false;
    this.cameraReady = false;
    this.placementReady = false;
  }

  async init(levelId = 3) {
    this.currentLevel = levelId;
    this.showReadyStatus();
    this.setupEarlyInteraction();

    await this.loadLevelData(levelId);
    if (!this.levelData?.shapes?.length) {
      this.levelData = this.getDefaultLevelData(levelId);
    }
    this.buildShapeSelector();
    this.setupLevelControls();
    this.setupPreviewModeButton();

    try {
      await Promise.race([
        this.waitForScene(),
        this.delay(2500)
      ]);

      this.scene = document.querySelector('a-scene');
      this.camera = document.querySelector('[camera]');
      this.groundPlane = document.getElementById('ground-plane');
      this.groundAnchor = document.getElementById('ground-anchor');
      this.shapesContainer = document.getElementById('shapes-container');

      this.registerEventListeners();
      this.setupGroundTracking();
      this.setupCameraEvents();
      this.setupPlacement();
      this.showReadyStatus();
      this.scheduleHideStatus();

      const placeBtn = document.getElementById('btn-place');
      if (placeBtn) placeBtn.style.display = 'block';

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') !== 'create' && this.levelData?.shapes?.length) {
        const first = this.levelData.shapes[0];
        this.selectShape(first.type, first.color);
      }

      if (urlParams.get('mode') === '3d' || window.AR3DHelper?.is3DMode()) {
        this.enablePreviewMode();
      } else {
        this.enablePreviewMode();
      }

      console.log('[AR Markerless] Initialized successfully');
    } catch (error) {
      console.error('[AR Markerless] Initialization failed:', error);
      this.showReadyStatus();
      this.enablePreviewMode();
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

  async loadLevelData(levelId) {
    try {
      const response = await fetch('data/levels.json');
      if (!response.ok) throw new Error('levels.json load failed');
      const data = await response.json();
      this.levelData = data.levels.find((level) => level.id === levelId);

      if (this.levelData) {
        document.getElementById('level-title').textContent =
          `레벨 ${this.levelData.id}: ${this.levelData.name}`;
        document.getElementById('level-desc').textContent =
          this.levelData.description;
      }
    } catch (error) {
      console.error('[AR Markerless] Failed to load level data:', error);
      this.levelData = this.getDefaultLevelData(levelId);
      const title = document.getElementById('level-title');
      const desc = document.getElementById('level-desc');
      if (title) title.textContent = `레벨 ${levelId}: ${this.levelData.name}`;
      if (desc) desc.textContent = this.levelData.description;
    }
  }

  getDefaultLevelData(levelId) {
    const defaults = {
      3: {
        id: 3,
        name: '입체 도형 기초',
        description: '정육면체, 직육면체, 구, 원기둥을 배워요',
        shapes: [
          { type: 'cube', color: '#845EF7', name: '정육면체' },
          { type: 'box', color: '#51CF66', name: '직육면체' },
          { type: 'sphere', color: '#FF6B6B', name: '구' },
          { type: 'cylinder', color: '#20C997', name: '원기둥' }
        ]
      },
      4: {
        id: 4,
        name: '입체 도형 심화',
        description: '각기둥, 각뿔, 원뿔을 배워요',
        shapes: [
          { type: 'prism', color: '#339AF0', name: '육각기둥' },
          { type: 'pyramid', color: '#FFA94D', name: '사각뿔' },
          { type: 'cone', color: '#FF8787', name: '원뿔' },
          { type: 'cube', color: '#845EF7', name: '정육면체' }
        ]
      },
      5: {
        id: 5,
        name: '넓이와 부피',
        description: '넓이와 부피를 배워요',
        shapes: [
          { type: 'cube', color: '#845EF7', name: '정육면체' },
          { type: 'cylinder', color: '#20C997', name: '원기둥' },
          { type: 'sphere', color: '#FF6B6B', name: '구' }
        ]
      }
    };
    return defaults[levelId] || defaults[3];
  }

  buildShapeSelector() {
    const container = document.getElementById('shape-buttons');
    const shapes = this.levelData?.shapes || this.getDefaultLevelData(this.currentLevel).shapes;
    if (!container || !shapes.length) return;

    container.innerHTML = '';
    shapes.forEach((shape) => {
      const btn = document.createElement('button');
      btn.className = 'shape-btn';
      btn.dataset.shape = shape.type;
      btn.innerHTML = `
        <span class="icon">${SHAPE_ICONS[shape.type] || '📐'}</span>
        <span class="name">${shape.name || this.getShapeName(shape.type)}</span>
      `;
      btn.addEventListener('click', () => this.selectShape(shape.type, shape.color));
      container.appendChild(btn);
    });
  }

  setupLevelControls() {
    const isLevel4 = this.currentLevel >= 4;
    document.querySelectorAll('.level4-only').forEach((el) => {
      el.style.display = isLevel4 ? 'flex' : 'none';
    });
  }

  setupGroundTracking() {
    this.scene.addEventListener('tick', () => {
      if (this.previewMode || !this.camera || !this.groundAnchor) return;

      const pos = this.camera.getAttribute('position');
      const rot = this.camera.getAttribute('rotation');
      const radY = (rot.y * Math.PI) / 180;

      const distance = 2;
      const x = pos.x - Math.sin(radY) * distance;
      const z = pos.z - Math.cos(radY) * distance;
      const y = pos.y - 1.2;

      this.groundAnchor.setAttribute('position', `${x} ${y} ${z}`);
      this.groundAnchor.setAttribute('rotation', `0 ${rot.y} 0`);
    });
  }

  setupCameraEvents() {
    const onCameraReady = () => {
      this.cameraReady = true;
      this.showReadyStatus(true);
    };

    window.addEventListener('arjs-video-loaded', onCameraReady);
    this.scene?.addEventListener('arjs-video-loaded', onCameraReady);

    window.addEventListener('camera-error', () => {
      this.showToast('카메라를 사용할 수 없어 3D 모드로 전환합니다');
      this.enablePreviewMode();
    });
  }

  setupPreviewModeButton() {
    const btn = document.getElementById('preview-mode-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      this.enablePreviewMode();
      this.showToast('3D 모드: 화면을 터치해 도형을 배치하세요');
    });
  }

  tryAutoPreviewMode() {
    if (!this.cameraReady && !this.previewMode) {
      this.enablePreviewMode();
      this.showToast('카메라 없이 3D 모드로 사용 중입니다');
    }
  }

  enablePreviewMode() {
    if (this.previewMode) return;
    this.previewMode = true;

    this.scene = this.scene || document.querySelector('a-scene');
    this.camera = document.querySelector('[camera]');
    this.groundAnchor = document.getElementById('ground-anchor');
    this.groundPlane = document.getElementById('ground-plane');
    this.shapesContainer = document.getElementById('shapes-container');

    if (window.AR3DHelper) {
      AR3DHelper.enable3DScene(this.scene);
      AR3DHelper.setupFixedGround(this.groundAnchor, this.groundPlane);
    }

    if (this.groundAnchor) {
      this.groundAnchor.setAttribute('visible', 'true');
      this.groundAnchor.setAttribute('position', '0 0 -4');
    }

    const btn = document.getElementById('preview-mode-btn');
    if (btn) {
      btn.classList.add('active');
      btn.textContent = '🖥️ 3D 모드 ON';
    }

    const placeBtn = document.getElementById('btn-place');
    if (placeBtn) placeBtn.style.display = 'block';

    const desc = document.getElementById('level-desc');
    if (desc) {
      desc.textContent = '3D 모드 — 초록 바닥 클릭=배치, 도형 클릭=선택, 🗑️=삭제';
    }

    // 3D 모드 전환 후 캔버스 클릭 다시 연결
    this.placementReady = false;
    if (this.scene) this.scene.dataset.placementBound = '';
    this.setupPlacement();

    this.hidePlaneStatus();
    this.showToast('초록 바닥을 클릭해 도형을 놓으세요');
  }

  setupPlacement() {
    if (!this.scene) return;
    if (this.placementReady) return;
    this.placementReady = true;

    if (!window.AR3DHelper) {
      console.error('[AR Markerless] AR3DHelper missing');
      return;
    }

    AR3DHelper.bindPlaceButton('btn-place', () => this.placeSelectedShape());

    // 이전 캔버스 바인딩 플래그 초기화 후 재연결
    const canvas = this.scene.canvas || this.scene.querySelector('canvas');
    if (canvas) delete canvas.dataset.arPlacementBound;
    this.scene.dataset.placementBound = '';

    AR3DHelper.bindCanvasPlacement(this.scene, (pos) => {
      if (this.scaleMode) return;
      this.onPlaneDetected();
      this.createAndPlaceShape(pos);
    }, {
      isBlocked: (target) => this.isOverlayUi(target),
      shapeCount: () => this.shapes.length,
      shapeType: () => this.selectedShapeType,
      shapeSize: () => 0.8,
      onSelectShape: (el) => {
        this.selectPlacedShape(el);
        this.showToast('도형을 선택했습니다. 🗑️로 삭제할 수 있어요');
      }
    });
  }

  isOverlayUi(target) {
    return !!target?.closest?.(
      '.shape-btn, .control-btn, .btn-back, .btn, .modal, .btn-close, ' +
      '.shape-selector, .plane-status, #help-modal, .preview-mode-btn, ' +
      '.place-shape-btn, .ar-header, .shape-info, .toast'
    );
  }

  placeSelectedShape() {
    if (!this.previewMode) this.enablePreviewMode();
    if (this.scaleMode) return;
    this.onPlaneDetected();
    const pos = window.AR3DHelper
      ? AR3DHelper.getDefaultPlacePosition(this.shapes.length, this.selectedShapeType, 0.8)
      : { x: 0, y: 0.4, z: -1.2 };
    this.createAndPlaceShape(pos);
  }

  showReadyStatus(cameraOn = false) {
    const statusEl = document.getElementById('plane-status');
    if (!statusEl) return;

    statusEl.style.display = 'block';
    statusEl.classList.remove('found');
    statusEl.onclick = () => this.hidePlaneStatus();

    if (cameraOn) {
      statusEl.innerHTML = `
        <p>📷 카메라 준비 완료!</p>
        <p class="hint">화면 가운데를 터치하여 도형을 배치하세요 (탭하면 닫기)</p>
      `;
    } else {
      statusEl.innerHTML = `
        <p>👆 화면을 터치하세요</p>
        <p class="hint">가상 평면에 도형이 배치됩니다 (탭하면 닫기)</p>
      `;
    }

    this.isReady = true;
  }

  scheduleHideStatus() {
    clearTimeout(this.statusHideTimer);
    this.statusHideTimer = setTimeout(() => this.hidePlaneStatus(), 6000);
  }

  hidePlaneStatus() {
    const statusEl = document.getElementById('plane-status');
    if (statusEl) statusEl.style.display = 'none';
  }

  setupEarlyInteraction() {
    if (this.earlyInteractionReady) return;
    this.earlyInteractionReady = true;

    window.selectShape = (type, color) => this.selectShape(type, color);
    window.toggleRotation = () => this.toggleRotation();
    window.toggleScale = () => this.toggleScale();
    window.toggleHighlight = () => this.toggleHighlight();
    window.toggleUnfold = () => this.toggleUnfold();
    window.toggleCrossSection = () => this.toggleCrossSection();
    window.deleteShape = () => this.deleteCurrentShape();
    window.toggleShapeInfo = () => this.toggleShapeInfo();
    window.closeShapeInfo = () => ARShapeControls?.hideInfoPanel();
  }

  registerEventListeners() {
    /* canvas placement: setupPlacement() + AR3DHelper */
  }

  onPlaneDetected() {
    this.isPlaneDetected = true;
    this.hidePlaneStatus();
  }

  selectShape(shapeType, color) {
    this.selectedShapeType = shapeType;
    if (color) this.selectedShapeColor = color;
    this.updateShapeButtons(shapeType);
    this.updateShapeInfo(shapeType);
    if (this.currentShape) {
      ARShapeControls?.updateInfo(shapeType);
    }
  }

  isUiClick(event) {
    const target = event.target;
    return target?.closest?.('.ar-overlay') &&
      !target?.closest?.('a-scene');
  }

  placeShapeInFrontOfCamera() {
    if (!this.camera) return;

    const pos = this.camera.getAttribute('position');
    const rot = this.camera.getAttribute('rotation');
    const radY = (rot.y * Math.PI) / 180;
    const distance = 2;

    this.createAndPlaceShape({
      x: pos.x - Math.sin(radY) * distance,
      y: pos.y - 0.5,
      z: pos.z - Math.cos(radY) * distance
    });
  }

  placeShapeAtIntersection(event) {
    try {
      const point = event.detail.intersection.point;
      this.createAndPlaceShape({
        x: point.x,
        y: point.y + 0.25,
        z: point.z
      });
    } catch (error) {
      console.error('[AR Markerless] Failed to place shape:', error);
      this.placeShapeInFrontOfCamera();
    }
  }

  createAndPlaceShape(position) {
    if (!this.shapesContainer) {
      this.shapesContainer = document.getElementById('shapes-container');
    }
    if (!this.shapesContainer) {
      console.warn('[AR Markerless] shapes-container not found');
      return;
    }

    if (!this.previewMode) this.enablePreviewMode();

    const size = 0.8;
    const localPos = window.AR3DHelper
      ? AR3DHelper.normalizePlacementPosition(
        this.scene,
        position,
        this.selectedShapeType,
        size
      )
      : position;
    const rotation = window.AR3DHelper
      ? AR3DHelper.getPlacementRotation(this.selectedShapeType)
      : { x: 0, y: 0, z: 0 };

    const shapeConfig = {
      type: this.selectedShapeType,
      color: this.selectedShapeColor,
      size,
      position: localPos,
      rotation,
      animation: false
    };

    const shapeEntity = GeometryShapes.create(shapeConfig);
    if (!shapeEntity) {
      this.showToast('도형 생성에 실패했습니다');
      return;
    }

    shapeEntity.dataset.shapeType = this.selectedShapeType;
    shapeEntity.setAttribute('visible', 'true');
    this.shapesContainer.appendChild(shapeEntity);
    this.shapesContainer.setAttribute('visible', 'true');

    if (window.AR3DHelper) {
      AR3DHelper.markShapeClickable(shapeEntity);
    } else {
      shapeEntity.classList.add('placed-shape', 'clickable-shape');
      shapeEntity.setAttribute('class', 'placed-shape clickable-shape');
    }

    const record = { entity: shapeEntity, type: this.selectedShapeType, config: shapeConfig };
    this.shapes.push(record);
    this.selectPlacedShape(shapeEntity, record);
    this.showToast(`${this.getShapeName(this.selectedShapeType)}을(를) 배치했습니다!`);
  }

  selectPlacedShape(entity, record) {
    if (!entity) return;
    this.currentShapeRecord = record || this.shapes.find((s) => s.entity === entity);
    this.selectedShapeType = this.currentShapeRecord?.type || entity.dataset.shapeType;
    if (window.ARShapeControls) {
      ARShapeControls.selectShape(entity, this);
    } else {
      this.currentShape = entity;
    }
  }

  getShapeName(type) {
    const info = GeometryShapes.getShapeInfo(type);
    return info?.name || type;
  }

  updateShapeInfo(shapeType) {
    if (window.ARShapeControls) {
      ARShapeControls.updateInfo(shapeType);
      const info = GeometryShapes.getShapeInfo(shapeType);
      const sidesRow = document.querySelector('.prop-sides');
      const facesRow = document.querySelector('.prop-faces');
      if (sidesRow && facesRow) {
        const is2d = info?.sides !== undefined && info?.faces === undefined;
        sidesRow.style.display = is2d ? 'block' : 'none';
        facesRow.style.display = is2d ? 'none' : 'block';
      }
    }
  }

  updateShapeButtons(shapeType) {
    document.querySelectorAll('.shape-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.shape === shapeType);
    });
  }

  toggleRotation() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 배치해주세요');
      return;
    }
    if (window.ARShapeControls) ARShapeControls.toggleRotation(this);
    this.showToast(this.rotationEnabled ? '회전 ON' : '회전 OFF');
  }

  toggleScale() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 배치해주세요');
      return;
    }
    if (window.ARShapeControls) ARShapeControls.toggleScale(this);
    this.showToast('크기가 변경되었습니다');
  }

  enableScaleGesture() {
    if (!this.currentShape) return;

    let scaleValue = this.currentShape.getAttribute('scale')?.x || 1;
    let tapCount = 0;

    const tapHandler = (e) => {
      e.stopPropagation();
      tapCount++;
      setTimeout(() => {
        if (tapCount >= 2) {
          scaleValue = Math.min(scaleValue + 0.2, 2.0);
        } else {
          scaleValue = Math.max(scaleValue - 0.2, 0.3);
        }
        this.currentShape.setAttribute('scale', {
          x: scaleValue,
          y: scaleValue,
          z: scaleValue
        });
        tapCount = 0;
      }, 280);
    };

    this.currentShape.addEventListener('click', tapHandler);
    this.scaleGestureHandler = tapHandler;
  }

  disableScaleGesture() {
    if (this.currentShape && this.scaleGestureHandler) {
      this.currentShape.removeEventListener('click', this.scaleGestureHandler);
      this.scaleGestureHandler = null;
    }
  }

  toggleHighlight() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 배치해주세요');
      return;
    }
    if (window.ARShapeControls) ARShapeControls.toggleHighlight(this);
    const labels = { none: '강조 끔', faces: '면 강조', edges: '모서리 강조', vertices: '꼭짓점 강조' };
    this.showToast(labels[this.highlightMode] || '');
  }

  applyHighlightMode() {
    if (!this.currentShape) return;
    GeometryShapes.highlightProperties(this.currentShape, this.highlightMode, this.selectedShapeType);
  }

  toggleUnfold() {
    if (!this.currentShape || this.currentLevel < 4) {
      this.showToast('도형을 먼저 배치해주세요');
      return;
    }

    this.isUnfolded = !this.isUnfolded;
    GeometryShapes.toggleUnfold(
      this.currentShape,
      this.selectedShapeType,
      this.isUnfolded
    );
    document.getElementById('btn-unfold')?.classList.toggle('active', this.isUnfolded);
    this.showToast(this.isUnfolded ? '전개도 펼치기' : '전개도 접기');
  }

  toggleCrossSection() {
    if (!this.currentShape || this.currentLevel < 4) {
      this.showToast('도형을 먼저 배치해주세요');
      return;
    }

    this.isCrossSection = !this.isCrossSection;
    GeometryShapes.toggleCrossSection(this.currentShape, this.isCrossSection);
    document.getElementById('btn-section')?.classList.toggle('active', this.isCrossSection);
    this.showToast(this.isCrossSection ? '단면 보기' : '단면 끄기');
  }

  deleteCurrentShape() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 눌러 선택하세요');
      return;
    }
    const shapeName = this.getShapeName(this.selectedShapeType);
    if (window.ARShapeControls) {
      ARShapeControls.deleteShape(this);
    }
    this.showToast(`${shapeName}을(를) 삭제했습니다`);
  }

  toggleShapeInfo() {
    if (!this.currentShape && !this.shapes.length) {
      this.showToast('먼저 도형을 배치해주세요');
      return;
    }
    if (!this.currentShape && this.shapes.length) {
      const last = this.shapes[this.shapes.length - 1];
      this.selectPlacedShape(last.entity, last);
    }
    this.updateShapeInfo(this.selectedShapeType);
    const panel = document.getElementById('shape-info');
    const isOpen = panel && panel.classList.contains('visible');
    if (isOpen) {
      ARShapeControls?.hideInfoPanel();
    } else {
      ARShapeControls?.showInfoPanel();
    }
  }

  startQuiz() {
    window.location.href = `quiz.html?level=${this.currentLevel}`;
  }

  showToast(message) {
    document.querySelector('.toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }

  showError(message) {
    alert(message);
  }

  saveProgress() {
    if (!this.levelData || typeof ProgressTracker === 'undefined') return;

    const progress = ProgressTracker.getProgress();
    if (!progress.arSessions) progress.arSessions = {};
    progress.arSessions[this.levelData.id] = {
      shapesPlaced: this.shapes.length,
      timestamp: Date.now()
    };
    ProgressTracker.saveProgress(progress);
  }
}

const arController = new ARMarkerlessController();
window.arController = arController;

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const levelId = parseInt(urlParams.get('level'), 10) || 3;

  if (window.ARStatus) {
    window.ARStatus.initMarkerless();
  }

  arController.setupEarlyInteraction();
  arController.init(levelId);
});

window.addEventListener('beforeunload', () => {
  arController.saveProgress();
});

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }

  .toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    z-index: 10000;
    animation: fadeInOut 2s ease-in-out;
  }

  .shape-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .control-btn.active {
    background: #667eea;
    color: white;
  }
`;
document.head.appendChild(style);
