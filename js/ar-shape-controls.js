/**
 * AR 도형 컨트롤 공통 (마커 / 마커리스 3D 모드)
 */
const ARShapeControls = {
  updateInfo(shapeType) {
    const info = GeometryShapes.getShapeInfo(shapeType);
    if (!info) return;

    const set = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    set('shape-name', info.name);
    set('shape-faces', info.faces !== undefined ? `${info.faces}개` : '-');
    set('shape-edges', info.edges !== undefined ? `${info.edges}개` : '-');
    set('shape-vertices', info.vertices !== undefined ? `${info.vertices}개` : '-');
    set('shape-sides', info.sides !== undefined ? `${info.sides}개` : '-');
    set('shape-description', info.description || '');
    const is2d = info.sides !== undefined && info.faces === undefined;
    const formulaLabel = document.getElementById('shape-formula-label');
    if (formulaLabel) formulaLabel.textContent = is2d ? '넓이:' : '부피:';
    set('shape-volume', info.volumeFormula || info.areaFormula || 'N/A');
  },

  showInfoPanel() {
    const panel = document.getElementById('shape-info');
    if (!panel) return;
    panel.style.display = 'block';
    panel.classList.add('visible');
  },

  hideInfoPanel() {
    const panel = document.getElementById('shape-info');
    if (!panel) return;
    panel.style.display = 'none';
    panel.classList.remove('visible');
  },

  toggleInfoPanel(hasShape) {
    const panel = document.getElementById('shape-info');
    if (!panel) return;
    const visible = panel.style.display !== 'none' && panel.classList.contains('visible');
    if (visible) {
      this.hideInfoPanel();
    } else if (hasShape) {
      this.showInfoPanel();
    }
    return !visible;
  },

  selectShape(entity, controller) {
    if (!entity) return;

    if (controller.currentShape && controller.currentShape !== entity) {
      this.clearSelection(controller.currentShape);
    }

    controller.currentShape = entity;

    const record = Array.isArray(controller.shapes)
      ? controller.shapes.find((s) => (s.entity || s) === entity)
      : null;
    if (record) controller.currentShapeRecord = record;

    this.markSelected(entity);
    const type = entity.dataset?.shapeType || record?.type || controller.selectedShapeType;
    controller.selectedShapeType = type;
    this.updateInfo(type);
    // 정보 패널은 ℹ️ 버튼을 눌렀을 때만 표시
  },

  markSelected(entity) {
    if (!entity) return;

    entity.setAttribute('data-selected', 'true');

    // 예전 선택 링(노란 반원)이 남아 있으면 제거
    entity.querySelectorAll('.selection-ring, .sel-ring').forEach((ring) => {
      if (ring.parentNode) ring.parentNode.removeChild(ring);
    });

    // 선택됨: 살짝 키우기만 (링 표시 없음)
    const scale = entity.getAttribute('scale') || { x: 1, y: 1, z: 1 };
    const baseX = entity.dataset.baseScaleX
      ? parseFloat(entity.dataset.baseScaleX)
      : (scale.x || 1);
    if (!entity.dataset.baseScaleX) {
      entity.dataset.baseScaleX = String(baseX);
      entity.dataset.baseScaleY = String(scale.y || 1);
      entity.dataset.baseScaleZ = String(scale.z || 1);
    }
    const bx = parseFloat(entity.dataset.baseScaleX);
    const by = parseFloat(entity.dataset.baseScaleY);
    const bz = parseFloat(entity.dataset.baseScaleZ);
    entity.setAttribute('scale', `${bx * 1.08} ${by * 1.08} ${bz * 1.08}`);
  },

  clearSelection(entity) {
    if (!entity) return;
    entity.removeAttribute('data-selected');

    entity.querySelectorAll('.selection-ring, .sel-ring').forEach((ring) => {
      if (ring.parentNode) ring.parentNode.removeChild(ring);
    });

    if (entity.dataset.baseScaleX) {
      entity.setAttribute(
        'scale',
        `${entity.dataset.baseScaleX} ${entity.dataset.baseScaleY} ${entity.dataset.baseScaleZ}`
      );
    }
  },

  deleteShape(controller) {
    if (!controller.currentShape) return false;

    const removed = controller.currentShape;
    this.clearSelection(removed);

    const parent = removed.parentNode;
    if (parent) parent.removeChild(removed);

    if (Array.isArray(controller.shapes)) {
      controller.shapes = controller.shapes.filter((s) => {
        const entity = s.entity || s;
        return entity !== removed;
      });
    }

    controller.currentShape = null;
    controller.currentShapeRecord = null;

    // 남은 도형이 있으면 마지막 것을 선택
    if (Array.isArray(controller.shapes) && controller.shapes.length) {
      const last = controller.shapes[controller.shapes.length - 1];
      const entity = last.entity || last;
      this.selectShape(entity, controller);
    } else {
      this.hideInfoPanel();
    }

    return true;
  },

  /**
   * 회전 모드 ON/OFF
   * ON이면 마우스로 드래그해 선택한 도형을 회전
   */
  toggleRotation(controller) {
    if (!controller.currentShape) return false;

    controller.currentShape.removeAttribute('animation');
    controller.rotationEnabled = !controller.rotationEnabled;

    document.getElementById('btn-rotate')?.classList.toggle(
      'active',
      controller.rotationEnabled
    );

    this.bindDragRotate(controller);

    // 회전 모드 동안 카메라 시점 조작 끄기 (드래그와 충돌 방지)
    this.setLookControls(controller, !controller.rotationEnabled);
    document.body.style.cursor = controller.rotationEnabled ? 'grab' : '';
    document.body.classList.toggle('rotation-mode', controller.rotationEnabled);

    return controller.rotationEnabled;
  },

  parseRotation(entity) {
    const rot = entity.getAttribute('rotation');
    if (!rot) return { x: 0, y: 0, z: 0 };
    if (typeof rot === 'string') {
      const p = rot.trim().split(/\s+/).map(Number);
      return { x: p[0] || 0, y: p[1] || 0, z: p[2] || 0 };
    }
    return {
      x: Number(rot.x) || 0,
      y: Number(rot.y) || 0,
      z: Number(rot.z) || 0
    };
  },

  bindDragRotate(controller) {
    if (controller._dragRotateBound) return;
    controller._dragRotateBound = true;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const isUiTarget = (target) => {
      if (!target || !target.closest) return false;
      return !!target.closest(
        'button, input, select, textarea, a, .shape-selector, .shape-panel, ' +
          '.shape-btn, .control-btn, .btn-place, .btn-back, .modal, .camera-test-panel, ' +
          '.preview-mode-btn, .place-shape-btn, .scale-controls, .info-panel, .ar-header, ' +
          '.shape-info, .marker-status, .btn-camera-test'
      );
    };

    const pointerPos = (e) => {
      if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      if (e.changedTouches && e.changedTouches[0]) {
        return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
      }
      if (typeof e.clientX === 'number') {
        return { x: e.clientX, y: e.clientY };
      }
      return null;
    };

    controller._onRotDown = (e) => {
      if (!controller.rotationEnabled || !controller.currentShape) return;
      if (isUiTarget(e.target)) return;

      const pos = pointerPos(e);
      if (!pos) return;
      dragging = true;
      lastX = pos.x;
      lastY = pos.y;
      document.body.style.cursor = 'grabbing';
      if (e.cancelable) e.preventDefault();
    };

    controller._onRotMove = (e) => {
      if (!dragging || !controller.rotationEnabled || !controller.currentShape) return;
      const pos = pointerPos(e);
      if (!pos) return;

      const dx = pos.x - lastX;
      const dy = pos.y - lastY;
      lastX = pos.x;
      lastY = pos.y;
      this.applyDragRotation(controller, dx, dy);
      if (e.cancelable) e.preventDefault();
    };

    controller._onRotUp = () => {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = controller.rotationEnabled ? 'grab' : '';
    };

    // 캡처 단계에서 받아 look-controls보다 먼저 처리
    const opts = { capture: true, passive: false };
    window.addEventListener('pointerdown', controller._onRotDown, opts);
    window.addEventListener('pointermove', controller._onRotMove, opts);
    window.addEventListener('pointerup', controller._onRotUp, opts);
    window.addEventListener('pointercancel', controller._onRotUp, opts);
    // 구형 브라우저 / 터치 보조
    window.addEventListener('mousedown', controller._onRotDown, true);
    window.addEventListener('mousemove', controller._onRotMove, true);
    window.addEventListener('mouseup', controller._onRotUp, true);
    window.addEventListener('touchstart', controller._onRotDown, opts);
    window.addEventListener('touchmove', controller._onRotMove, opts);
    window.addEventListener('touchend', controller._onRotUp, true);
  },

  applyDragRotation(controller, dx, dy) {
    const entity = controller.currentShape;
    if (!entity) return;

    const type = entity.dataset?.shapeType || controller.selectedShapeType || '';
    const flat2d = [
      'triangle', 'rightTriangle', 'isoscelesTriangle', 'quad',
      'square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'circle'
    ];
    const rot = this.parseRotation(entity);
    const speed = 0.7;

    let x = rot.x;
    let y = rot.y;
    let z = rot.z;

    // 좌우 드래그 → Y축, 상하 드래그 → X축 (평면 도형은 Y만)
    y -= dx * speed;
    if (!flat2d.includes(type)) {
      x += dy * speed;
    }

    entity.setAttribute('rotation', `${x} ${y} ${z}`);

    // A-Frame object3D에도 즉시 반영 (레벨 1-2 평면 도형 포함)
    if (entity.object3D) {
      const deg = Math.PI / 180;
      entity.object3D.rotation.set(x * deg, y * deg, z * deg);
      entity.object3D.updateMatrixWorld(true);
    }
  },

  setLookControls(controller, enabled) {
    const scene = controller.scene || document.querySelector('a-scene');
    if (!scene) return;
    scene.querySelectorAll('[camera], #main-camera, #cam').forEach((cam) => {
      if (enabled) {
        cam.setAttribute(
          'look-controls',
          'enabled: true; magicWindowTrackingEnabled: false; pointerLockEnabled: false'
        );
      } else {
        cam.setAttribute('look-controls', 'enabled: false');
      }
    });
  },

  MIN_SCALE: 0.3,
  MAX_SCALE: 2.0,
  SCALE_STEP: 0.2,

  /** 크기 조절 (+ / -). delta > 0 이면 확대, < 0 이면 축소 */
  scaleBy(controller, delta) {
    if (!controller.currentShape) return null;

    const entity = controller.currentShape;
    if (!entity.dataset.baseScaleX) {
      const scale = entity.getAttribute('scale') || { x: 1, y: 1, z: 1 };
      const selected = entity.getAttribute('data-selected') === 'true';
      const factor = selected ? 1.08 : 1;
      entity.dataset.baseScaleX = String((scale.x || 1) / factor);
      entity.dataset.baseScaleY = String((scale.y || 1) / factor);
      entity.dataset.baseScaleZ = String((scale.z || 1) / factor);
    }

    const step = delta >= 0 ? this.SCALE_STEP : -this.SCALE_STEP;
    const next = Math.min(
      this.MAX_SCALE,
      Math.max(this.MIN_SCALE, parseFloat(entity.dataset.baseScaleX) + step)
    );

    entity.dataset.baseScaleX = String(next);
    entity.dataset.baseScaleY = String(next);
    entity.dataset.baseScaleZ = String(next);

    const selected = entity.getAttribute('data-selected') === 'true';
    const factor = selected ? 1.08 : 1;
    entity.setAttribute('scale', `${next * factor} ${next * factor} ${next * factor}`);

    return Math.round(next * 100) / 100;
  },

  scaleUp(controller) {
    return this.scaleBy(controller, 1);
  },

  scaleDown(controller) {
    return this.scaleBy(controller, -1);
  },

  /** @deprecated scaleUp 사용 */
  toggleScale(controller) {
    return this.scaleUp(controller);
  },

  toggleHighlight(controller) {
    if (!controller.currentShape) return;
    const modes = controller.highlightModes || ['none', 'faces', 'edges', 'vertices'];
    const idx = modes.indexOf(controller.highlightMode || 'none');
    controller.highlightMode = modes[(idx + 1) % modes.length];
    GeometryShapes.highlightProperties(
      controller.currentShape,
      controller.highlightMode,
      controller.selectedShapeType
    );
    document.getElementById('btn-highlight')?.classList.toggle(
      'active',
      controller.highlightMode !== 'none'
    );
  }
};

if (typeof window !== 'undefined') {
  window.ARShapeControls = ARShapeControls;
}
