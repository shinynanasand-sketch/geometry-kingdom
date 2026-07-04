/**
 * AR Markerless Controller
 * 레벨 3-4: A-Frame 3D로 도형 배치·선택·조작
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
    this.selectedShapeType = 'cube';
    this.selectedShapeColor = '#845EF7';
    this.rotationEnabled = false;
    this.highlightMode = 'none';
    this.highlightModes = ['none', 'faces', 'edges', 'vertices'];
    this.isUnfolded = false;
    this.isCrossSection = false;
    this.levelData = null;
    this.currentLevel = 3;
    this.previewMode = true;
    this.placementReady = false;
    this._placing = false;
  }

  async init(levelId = 3) {
    this.currentLevel = levelId;
    this.bindGlobalHandlers();

    await this.loadLevelData(levelId);
    if (!this.levelData?.shapes?.length) {
      this.levelData = this.getDefaultLevelData(levelId);
    }

    this.buildShapeSelector();
    this.setupLevelControls();
    this.updateLevelTitle();

    await this.waitForScene();

    this.scene = document.querySelector('a-scene');
    this.camera = document.querySelector('#main-camera') || document.querySelector('[camera]');
    this.groundPlane = document.getElementById('ground-plane');
    this.groundAnchor = document.getElementById('ground-anchor');
    this.shapesContainer = document.getElementById('shapes-container');

    if (window.AR3DHelper) {
      AR3DHelper.enable3DScene(this.scene);
      AR3DHelper.setupFixedGround(this.groundAnchor, this.groundPlane);
    }

    this.setupPlacement();

    if (this.levelData?.shapes?.[0]) {
      const first = this.levelData.shapes[0];
      this.selectShape(first.type, first.color);
    }

    const placeBtn = document.getElementById('btn-place');
    if (placeBtn) placeBtn.style.display = 'block';

    this.showToast('도형을 고른 뒤 📍 도형 놓기를 누르세요');
    console.log('[AR Markerless] Ready, level', this.currentLevel);
  }

  bindGlobalHandlers() {
    window.selectShape = (type, color) => this.selectShape(type, color);
    window.selectShapeType = (type, color) => this.selectShape(type, color);
    window.placeShape = () => this.placeSelectedShape();
    window.toggleRotation = () => this.toggleRotation();
    window.scaleUp = () => this.scaleUp();
    window.scaleDown = () => this.scaleDown();
    window.toggleHighlight = () => this.toggleHighlight();
    window.toggleUnfold = () => this.toggleUnfold();
    window.toggleCrossSection = () => this.toggleCrossSection();
    window.deleteShape = () => this.deleteCurrentShape();
    window.toggleShapeInfo = () => this.toggleShapeInfo();
    window.closeShapeInfo = () => ARShapeControls?.hideInfoPanel();
    window.startQuiz = () => this.startQuiz();
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
      scene.addEventListener('loaded', () => resolve(), { once: true });
      setTimeout(resolve, 2000);
    });
  }

  async loadLevelData(levelId) {
    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      this.levelData = data.levels.find((l) => l.id === levelId) || null;
    } catch (error) {
      console.warn('[AR Markerless] levels.json load failed, using defaults');
      this.levelData = null;
    }
  }

  getDefaultLevelData(levelId) {
    if (levelId >= 4) {
      return {
        id: 4,
        name: '입체 도형 심화',
        shapes: [
          { type: 'prism', color: '#339AF0', name: '육각기둥' },
          { type: 'pyramid', color: '#FF922B', name: '사각뿔' },
          { type: 'cone', color: '#F06595', name: '원뿔' },
          { type: 'cube', color: '#845EF7', name: '정육면체' }
        ]
      };
    }
    return {
      id: 3,
      name: '입체 도형 기초',
      shapes: [
        { type: 'cube', color: '#845EF7', name: '정육면체' },
        { type: 'box', color: '#51CF66', name: '직육면체' },
        { type: 'sphere', color: '#FF6B6B', name: '구' },
        { type: 'cylinder', color: '#20C997', name: '원기둥' }
      ]
    };
  }

  updateLevelTitle() {
    const title = document.getElementById('level-title');
    const desc = document.getElementById('level-desc');
    if (title && this.levelData) {
      title.textContent = `레벨 ${this.levelData.id}: ${this.levelData.name}`;
    }
    if (desc) {
      desc.textContent = '도형을 고른 뒤 📍 도형 놓기를 누르세요';
    }
  }

  buildShapeSelector() {
    const container = document.getElementById('shape-buttons');
    const shapes = this.levelData?.shapes || [];
    if (!container || !shapes.length) return;

    container.innerHTML = '';
    shapes.forEach((shape, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shape-btn' + (index === 0 ? ' active' : '');
      btn.dataset.shape = shape.type;
      btn.innerHTML = `
        <span class="icon">${SHAPE_ICONS[shape.type] || '📐'}</span>
        <span class="name">${shape.name || shape.type}</span>
      `;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.selectShape(shape.type, shape.color);
      });
      container.appendChild(btn);
    });
  }

  setupLevelControls() {
    const isLevel4 = this.currentLevel >= 4;
    document.querySelectorAll('.level4-only').forEach((el) => {
      el.style.display = isLevel4 ? 'flex' : 'none';
    });
  }

  setupPlacement() {
    if (!this.scene || this.placementReady) return;
    this.placementReady = true;

    // 📍 버튼 — HTML onclick + JS 이중 연결
    const placeBtn = document.getElementById('btn-place');
    if (placeBtn && !placeBtn.dataset.jsBound) {
      placeBtn.dataset.jsBound = '1';
      placeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.placeSelectedShape();
      });
    }

    if (window.AR3DHelper) {
      const canvas = this.scene.canvas || this.scene.querySelector('canvas');
      if (canvas) delete canvas.dataset.arPlacementBound;
      this.scene.dataset.placementBound = '';

      AR3DHelper.bindCanvasPlacement(
        this.scene,
        (pos) => this.createAndPlaceShape(pos),
        {
          isBlocked: (target) => this.isOverlayUi(target),
          shapeCount: () => this.shapes.length,
          shapeType: () => this.selectedShapeType,
          shapeSize: () => 0.8,
          onSelectShape: (el) => {
            this.selectPlacedShape(el);
            this.showToast('도형을 선택했습니다');
          }
        }
      );
    }
  }

  isOverlayUi(target) {
    return !!target?.closest?.(
      '.shape-btn, .control-btn, .btn-back, .btn, .modal, .btn-close, ' +
        '.shape-selector, .plane-status, #help-modal, .preview-mode-btn, ' +
        '.place-shape-btn, .ar-header, .shape-info, .toast, .scale-controls'
    );
  }

  selectShape(shapeType, color) {
    this.selectedShapeType = shapeType || 'cube';
    if (color) this.selectedShapeColor = color;
    this.updateShapeButtons(this.selectedShapeType);
    this.updateShapeInfo(this.selectedShapeType);
  }

  updateShapeButtons(shapeType) {
    document.querySelectorAll('.shape-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.shape === shapeType);
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

  /** 📍 도형 놓기 — 항상 기본 위치에 1개 배치 */
  placeSelectedShape() {
    if (this._placing) return;
    this._placing = true;

    try {
      if (!this.shapesContainer) {
        this.shapesContainer = document.getElementById('shapes-container');
      }
      if (!this.shapesContainer) {
        this.showToast('화면을 불러오는 중입니다. 잠시 후 다시 눌러주세요');
        return;
      }

      const pos = window.AR3DHelper
        ? AR3DHelper.getDefaultPlacePosition(
            this.shapes.length,
            this.selectedShapeType,
            0.8
          )
        : {
            x: (this.shapes.length % 3 - 1) * 1.2,
            y: 0.4,
            z: -0.5 - Math.floor(this.shapes.length / 3) * 1.2
          };

      this.createAndPlaceShape(pos);
    } finally {
      setTimeout(() => {
        this._placing = false;
      }, 200);
    }
  }

  createAndPlaceShape(position) {
    if (!this.shapesContainer) {
      this.shapesContainer = document.getElementById('shapes-container');
    }
    if (!this.shapesContainer) {
      console.error('[AR Markerless] shapes-container missing');
      this.showToast('도형을 놓을 수 없습니다. 새로고침 해주세요');
      return;
    }

    if (!this.selectedShapeType) {
      this.selectedShapeType = 'cube';
      this.selectedShapeColor = '#845EF7';
    }

    const size = 0.8;
    let localPos = position || { x: 0, y: 0.4, z: -0.5 };

    // 기본 배치 좌표는 이미 로컬 좌표 — worldToLocal 하지 않음
    if (
      window.AR3DHelper &&
      position &&
      (Math.abs(position.x) > 3 || Math.abs(position.z) > 3)
    ) {
      localPos = AR3DHelper.normalizePlacementPosition(
        this.scene,
        position,
        this.selectedShapeType,
        size
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

    const shapeEntity = GeometryShapes.create({
      type: this.selectedShapeType,
      color: this.selectedShapeColor,
      size,
      position: localPos,
      rotation,
      animation: false
    });

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
      shapeEntity.setAttribute('class', 'placed-shape clickable-shape');
    }

    const record = {
      entity: shapeEntity,
      type: this.selectedShapeType,
      color: this.selectedShapeColor
    };
    this.shapes.push(record);
    this.selectPlacedShape(shapeEntity, record);

    const name = this.getShapeName(this.selectedShapeType);
    this.showToast(`${name}을(를) 배치했습니다!`);
  }

  selectPlacedShape(entity, record) {
    if (!entity) return;
    this.currentShapeRecord =
      record || this.shapes.find((s) => s.entity === entity);
    this.selectedShapeType =
      this.currentShapeRecord?.type || entity.dataset.shapeType;

    if (this.currentShapeRecord?.color) {
      this.selectedShapeColor = this.currentShapeRecord.color;
    }

    if (window.ARShapeControls) {
      ARShapeControls.selectShape(entity, this);
    } else {
      this.currentShape = entity;
    }
    this.updateShapeButtons(this.selectedShapeType);
  }

  getShapeName(type) {
    return GeometryShapes.getShapeInfo(type)?.name || type;
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
      this.showToast('먼저 도형을 놓거나 선택하세요');
      return;
    }
    const value = ARShapeControls?.scaleUp(this);
    if (value != null) this.showToast(`크기 + (${value})`);
  }

  scaleDown() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 놓거나 선택하세요');
      return;
    }
    const value = ARShapeControls?.scaleDown(this);
    if (value != null) this.showToast(`크기 − (${value})`);
  }

  toggleHighlight() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 놓거나 선택하세요');
      return;
    }
    if (window.ARShapeControls) ARShapeControls.toggleHighlight(this);
    const labels = {
      none: '강조 끔',
      faces: '면 강조',
      edges: '모서리 강조',
      vertices: '꼭짓점 강조'
    };
    this.showToast(labels[this.highlightMode] || '');
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
    document
      .getElementById('btn-section')
      ?.classList.toggle('active', this.isCrossSection);
    this.showToast(this.isCrossSection ? '단면 보기' : '단면 끄기');
  }

  deleteCurrentShape() {
    if (!this.currentShape) {
      this.showToast('먼저 도형을 눌러 선택하세요');
      return;
    }
    const shapeName = this.getShapeName(this.selectedShapeType);
    if (window.ARShapeControls) ARShapeControls.deleteShape(this);
    this.showToast(`${shapeName}을(를) 삭제했습니다`);
  }

  toggleShapeInfo() {
    if (!this.currentShape && this.shapes.length) {
      const last = this.shapes[this.shapes.length - 1];
      this.selectPlacedShape(last.entity, last);
    }
    if (!this.currentShape) {
      this.showToast('먼저 도형을 배치해주세요');
      return;
    }
    this.updateShapeInfo(this.selectedShapeType);
    ARShapeControls?.toggleInfoPanel(true);
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

function startMarkerless() {
  const urlParams = new URLSearchParams(window.location.search);
  const levelId = parseInt(urlParams.get('level'), 10) || 3;
  arController.init(levelId);
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', startMarkerless);
} else {
  startMarkerless();
}

window.addEventListener('beforeunload', () => {
  arController.saveProgress();
});

const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    z-index: 10000;
    pointer-events: none;
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
