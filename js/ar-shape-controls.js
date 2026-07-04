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
    this.showInfoPanel();
  },

  markSelected(entity) {
    if (!entity) return;

    entity.setAttribute('data-selected', 'true');

    let ring = entity.querySelector('.selection-ring');
    if (!ring) {
      ring = document.createElement('a-ring');
      ring.classList.add('selection-ring');
      ring.setAttribute('class', 'selection-ring');
      ring.setAttribute('radius-inner', '0.55');
      ring.setAttribute('radius-outer', '0.7');
      ring.setAttribute('rotation', '-90 0 0');
      ring.setAttribute('position', '0 0.03 0');
      ring.setAttribute('color', '#FFD43B');
      ring.setAttribute('material', 'shader: flat; opacity: 0.95; transparent: true; side: double');
      entity.appendChild(ring);
    }
    ring.setAttribute('visible', 'true');

    // 선택됨을 살짝 키워서 구분
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

    const ring = entity.querySelector('.selection-ring');
    if (ring) ring.setAttribute('visible', 'false');

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

  toggleRotation(controller) {
    if (!controller.currentShape) return;
    controller.rotationEnabled = !controller.rotationEnabled;

    if (controller.rotationEnabled) {
      controller.currentShape.setAttribute('animation', {
        property: 'rotation',
        to: '0 360 0',
        loop: true,
        dur: 8000,
        easing: 'linear'
      });
    } else {
      controller.currentShape.removeAttribute('animation');
    }
    document.getElementById('btn-rotate')?.classList.toggle('active', controller.rotationEnabled);
  },

  toggleScale(controller) {
    if (!controller.currentShape) return;
    const entity = controller.currentShape;
    const baseX = parseFloat(entity.dataset.baseScaleX || '1');
    const baseY = parseFloat(entity.dataset.baseScaleY || '1');
    const baseZ = parseFloat(entity.dataset.baseScaleZ || '1');
    const next = Math.min(baseX + 0.2, 2);
    entity.dataset.baseScaleX = String(next);
    entity.dataset.baseScaleY = String(Math.min(baseY + 0.2, 2));
    entity.dataset.baseScaleZ = String(Math.min(baseZ + 0.2, 2));
    const selected = entity.getAttribute('data-selected') === 'true';
    const factor = selected ? 1.08 : 1;
    entity.setAttribute(
      'scale',
      `${next * factor} ${parseFloat(entity.dataset.baseScaleY) * factor} ${parseFloat(entity.dataset.baseScaleZ) * factor}`
    );
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
