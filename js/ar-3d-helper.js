/**
 * AR 3D 모드 공통 헬퍼 (마커 / 마커리스)
 * 카메라 없이도 도형 학습 가능
 */
const AR3DHelper = {
  _lastPlaceAt: 0,
  _pointerDown: null,
  PLACE_COOLDOWN_MS: 300,
  DRAG_THRESHOLD_PX: 10,

  getThree() {
    return window.AFRAME?.THREE || window.THREE;
  },

  is3DMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === '3d';
  },

  worldToLocal(parentEl, point) {
    if (!parentEl?.object3D || !point) return point;
    const THREE = this.getThree();
    if (!THREE) return point;
    const local = new THREE.Vector3(point.x, point.y, point.z);
    parentEl.object3D.worldToLocal(local);
    return { x: local.x, y: local.y, z: local.z };
  },

  getPlacementParent(sceneEl) {
    return (
      document.getElementById('shapes-container') ||
      document.getElementById('ground-anchor') ||
      sceneEl
    );
  },

  getShapeGroundY(shapeType, size = 0.8) {
    const flat2d = [
      'triangle', 'rightTriangle', 'isoscelesTriangle', 'quad',
      'square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'circle'
    ];
    if (flat2d.includes(shapeType)) return 0.02;
    if (shapeType === 'sphere') return size * 0.5;
    if (shapeType === 'cylinder' || shapeType === 'cone') return size * 0.5;
    return size * 0.5;
  },

  getPlacementRotation(shapeType) {
    const flat2d = [
      'triangle', 'rightTriangle', 'isoscelesTriangle', 'quad',
      'square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'circle'
    ];
    if (flat2d.includes(shapeType)) {
      return { x: -90, y: 0, z: 0 };
    }
    return { x: 0, y: 0, z: 0 };
  },

  hideArVideo() {
    document.querySelectorAll('video').forEach((video) => {
      video.style.cssText =
        'display:none!important;visibility:hidden!important;pointer-events:none!important;';
      video.pause?.();
    });
    document.querySelectorAll('.arjs-loader, .a-enter-vr').forEach((el) => {
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
    });
  },

  /** 안정적인 3D 미리보기 씬 설정 */
  enable3DScene(sceneEl) {
    if (!sceneEl) return;

    sceneEl.removeAttribute('arjs');
    sceneEl.removeAttribute('cursor');
    sceneEl.removeAttribute('raycaster');
    sceneEl.setAttribute('background', 'color: #D0EBFF');
    sceneEl.setAttribute('vr-mode-ui', 'enabled: false');

    this.hideArVideo();
    setTimeout(() => this.hideArVideo(), 300);

    // AR.js가 추가한 여분 카메라 비활성화
    sceneEl.querySelectorAll('[camera]').forEach((cam) => {
      const inRig = !!cam.closest('#camera-rig');
      if (!inRig) {
        cam.removeAttribute('camera');
        cam.setAttribute('visible', 'false');
      }
    });

    const rig = sceneEl.querySelector('#camera-rig');
    if (rig) {
      rig.setAttribute('visible', 'true');
      rig.setAttribute('position', '0 2.4 4.5');
      rig.setAttribute('rotation', '-28 0 0');
    }

    const camera =
      sceneEl.querySelector('#main-camera') ||
      sceneEl.querySelector('#camera-rig [camera]') ||
      sceneEl.querySelector('[camera]');

    if (camera) {
      camera.setAttribute('camera', 'active: true');
      camera.setAttribute('position', '0 0 0');
      camera.setAttribute(
        'look-controls',
        'enabled: true; magicWindowTrackingEnabled: false; pointerLockEnabled: false'
      );
      camera.removeAttribute('wasd-controls');
    }

    const canvas = sceneEl.canvas || sceneEl.querySelector('canvas');
    if (canvas) {
      canvas.style.pointerEvents = 'auto';
      canvas.style.touchAction = 'none';
      canvas.style.zIndex = '1';
    }
  },

  setupFixedGround(groundAnchor, groundPlane) {
    if (groundAnchor) {
      // 카메라(0, 2.4, 4.5) 앞 바닥에 오도록
      groundAnchor.setAttribute('position', '0 0 0');
      groundAnchor.setAttribute('rotation', '0 0 0');
      groundAnchor.setAttribute('visible', 'true');
    }
    if (groundPlane) {
      groundPlane.setAttribute('position', '0 0 0');
      groundPlane.setAttribute('rotation', '-90 0 0');
      groundPlane.setAttribute('width', '14');
      groundPlane.setAttribute('height', '14');
      groundPlane.setAttribute(
        'material',
        'color: #51CF66; opacity: 0.55; transparent: true; shader: flat; side: double'
      );
      this.addClass(groundPlane, 'ground-plane');
    }
  },

  addClass(el, className) {
    if (!el || !className) return;
    const existing = (el.getAttribute('class') || '')
      .split(/\s+/)
      .filter(Boolean);
    if (!existing.includes(className)) existing.push(className);
    el.setAttribute('class', existing.join(' '));
    el.classList?.add(className);
  },

  markShapeClickable(entity) {
    if (!entity) return;
    this.addClass(entity, 'placed-shape');
    this.addClass(entity, 'clickable-shape');

    entity.querySelectorAll('*').forEach((child) => {
      if (child.classList?.contains('selection-ring')) return;
      const tag = (child.tagName || '').toUpperCase();
      if (tag.startsWith('A-')) {
        this.addClass(child, 'placed-shape');
        this.addClass(child, 'clickable-shape');
      }
    });
  },

  findPlacedShapeEl(el, sceneEl) {
    let cur = el;
    while (cur && cur !== sceneEl && cur !== document.body) {
      if (
        cur.classList?.contains('placed-shape') ||
        cur.classList?.contains('clickable-shape')
      ) {
        let root = cur;
        let parent = cur.parentElement;
        while (parent && parent !== sceneEl) {
          if (
            parent.classList?.contains('placed-shape') ||
            parent.classList?.contains('clickable-shape')
          ) {
            root = parent;
          }
          if (parent.id === 'shapes-container' || parent.id === 'ground-anchor') {
            break;
          }
          parent = parent.parentElement;
        }
        return root;
      }
      cur = cur.parentElement;
    }
    return null;
  },

  isGroundPlaneEl(el, sceneEl) {
    let cur = el;
    while (cur && cur !== sceneEl && cur !== document.body) {
      if (cur.classList?.contains('ground-plane') || cur.id === 'ground-plane') {
        return true;
      }
      cur = cur.parentElement;
    }
    return false;
  },

  /** THREE 오브젝트에서 A-Frame 엔티티 찾기 */
  elFromObject(object) {
    let obj = object;
    while (obj) {
      if (obj.el) return obj.el;
      obj = obj.parent;
    }
    return null;
  },

  /**
   * 화면 좌표로 레이캐스트 (A-Frame cursor 없이도 동작)
   */
  raycastScreen(sceneEl, clientX, clientY) {
    const THREE = this.getThree();
    if (!THREE || !sceneEl) return null;

    const canvas = sceneEl.canvas || sceneEl.querySelector('canvas');
    const cameraEl =
      sceneEl.querySelector('#camera-rig [camera]') ||
      sceneEl.querySelector('[camera]');
    if (!canvas || !cameraEl) return null;

    const camera = cameraEl.getObject3D('camera');
    if (!camera) return null;

    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;

    const mouse = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const targets = [];
    const ground = document.getElementById('ground-plane');
    if (ground?.object3D) targets.push(ground.object3D);

    const container = document.getElementById('shapes-container');
    if (container) {
      container.querySelectorAll('.placed-shape, .clickable-shape').forEach((el) => {
        if (el.object3D) targets.push(el.object3D);
      });
      // 클래스 누락 대비: 직접 자식도 포함
      Array.from(container.children).forEach((el) => {
        if (el.object3D && !targets.includes(el.object3D)) {
          targets.push(el.object3D);
        }
      });
    }

    if (!targets.length) return null;

    const hits = raycaster.intersectObjects(targets, true);
    if (!hits.length) return null;

    const hit = hits[0];
    const el = this.elFromObject(hit.object);
    return {
      el,
      point: { x: hit.point.x, y: hit.point.y, z: hit.point.z }
    };
  },

  getDefaultPlacePosition(index = 0, shapeType = 'cube', size = 0.8) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    return {
      x: (col - 1) * 1.2,
      y: this.getShapeGroundY(shapeType, size),
      z: -0.5 - row * 1.2
    };
  },

  normalizePlacementPosition(sceneEl, worldOrLocalPoint, shapeType = 'cube', size = 0.8) {
    const parent = this.getPlacementParent(sceneEl);
    let pos = { ...worldOrLocalPoint };

    const THREE = this.getThree();
    if (parent?.object3D && THREE && worldOrLocalPoint) {
      pos = this.worldToLocal(parent, worldOrLocalPoint);
    }

    return {
      x: pos.x,
      y: this.getShapeGroundY(shapeType, size),
      z: pos.z
    };
  },

  canPlaceNow() {
    const now = Date.now();
    if (now - this._lastPlaceAt < this.PLACE_COOLDOWN_MS) return false;
    this._lastPlaceAt = now;
    return true;
  },

  /**
   * 카메라가 켜지지 않으면 자동으로 카메라 꺼짐(3D) 모드로 전환
   * @param {{ onCameraReady?: Function, onFallback?: Function, timeoutMs?: number }} options
   */
  setupCameraAutoFallback(options = {}) {
    const onCameraReady = options.onCameraReady || (() => {});
    const onFallback = options.onFallback || (() => {});
    // 권한 허용 후 AR.js가 비디오를 붙일 때까지 대기 시간
    const timeoutMs = options.timeoutMs ?? 3000;

    let settled = false;
    let poll = null;

    const finishReady = () => {
      if (settled) return;
      settled = true;
      if (poll) clearInterval(poll);
      onCameraReady();
    };

    const finishFallback = (reason) => {
      if (settled) return;
      settled = true;
      if (poll) clearInterval(poll);
      onFallback(reason || 'unavailable');
    };

    // 카메라 API 없음 (권한/HTTPS/기기 미지원)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      finishFallback('unsupported');
      return;
    }

    const hasLiveCamera = () => {
      const videos = document.querySelectorAll('video');
      for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        const stream = video.srcObject;
        if (stream && typeof stream.getVideoTracks === 'function') {
          const live = stream.getVideoTracks().some(
            (track) => track.readyState === 'live' && track.enabled !== false
          );
          if (live) return true;
        }
        if (video.videoWidth > 0 && video.readyState >= 2) return true;
      }
      return false;
    };

    const startWatching = () => {
      poll = setInterval(() => {
        if (settled) {
          clearInterval(poll);
          return;
        }
        if (hasLiveCamera()) finishReady();
      }, 300);

      setTimeout(() => {
        if (settled) return;
        if (hasLiveCamera()) finishReady();
        else finishFallback('timeout');
      }, timeoutMs);
    };

    window.addEventListener('arjs-video-loaded', () => {
      if (hasLiveCamera()) finishReady();
    });
    window.addEventListener('camera-error', () => finishFallback('error'));
    document.addEventListener('camera-error', () => finishFallback('error'));

    // 권한 거부/카메라 없음 → 즉시 3D 모드
    // 권한 허용 → AR.js 비디오가 붙을 때까지 잠시 대기
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        stream.getTracks().forEach((track) => track.stop());
        startWatching();
      })
      .catch(() => {
        finishFallback('denied');
      });
  },

  bindPlaceButton(buttonId, onPlace) {
    const btn = document.getElementById(buttonId);
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = '1';
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.canPlaceNow()) return;
      onPlace();
    });
  },

  _clientPos(event) {
    if (event.changedTouches?.[0]) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      };
    }
    if (event.touches?.[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    if (typeof event.clientX === 'number') {
      return { x: event.clientX, y: event.clientY };
    }
    return null;
  },

  _wasDrag(upPos) {
    const down = this._pointerDown;
    if (!down || !upPos) return false;
    const dx = upPos.x - down.x;
    const dy = upPos.y - down.y;
    return Math.sqrt(dx * dx + dy * dy) > this.DRAG_THRESHOLD_PX;
  },

  /**
   * 캔버스 직접 클릭 + THREE 레이캐스트
   * (A-Frame cursor 이벤트에 의존하지 않음)
   */
  bindCanvasPlacement(sceneEl, onPlace, options = {}) {
    if (!sceneEl || sceneEl.dataset.placementBound) return;
    sceneEl.dataset.placementBound = '1';

    const handleTap = (clientX, clientY, domTarget) => {
      // 오버레이 UI(버튼 등)는 무시 — 캔버스 클릭만 처리
      if (domTarget && options.isBlocked?.(domTarget)) return;

      this.hideArVideo();

      const hit = this.raycastScreen(sceneEl, clientX, clientY);

      // 도형 클릭 → 선택만
      if (hit?.el) {
        const shapeEl = this.findPlacedShapeEl(hit.el, sceneEl);
        if (shapeEl) {
          options.onSelectShape?.(shapeEl);
          return;
        }

        // 초록 바닥 클릭 → 그 위치에 배치
        if (this.isGroundPlaneEl(hit.el, sceneEl) && hit.point) {
          if (!this.canPlaceNow()) return;
          onPlace(
            this.normalizePlacementPosition(
              sceneEl,
              hit.point,
              options.shapeType?.(),
              options.shapeSize?.()
            )
          );
          return;
        }
      }

      // 바닥을 못 맞춰도 캔버스를 눌렀으면 기본 위치에 1개 배치
      // (카메라 각도/로딩 타이밍 문제로 레이캐스트가 실패하는 경우)
      if (!this.canPlaceNow()) return;
      const count =
        typeof options.shapeCount === 'function'
          ? options.shapeCount()
          : options.shapeCount || 0;
      onPlace(
        this.getDefaultPlacePosition(
          count,
          options.shapeType?.(),
          options.shapeSize?.()
        )
      );
    };

    const onDown = (event) => {
      const pos = this._clientPos(event);
      if (pos) this._pointerDown = pos;
    };

    const onUp = (event) => {
      const pos = this._clientPos(event);
      if (!pos) {
        this._pointerDown = null;
        return;
      }
      if (this._wasDrag(pos)) {
        this._pointerDown = null;
        return;
      }
      this._pointerDown = null;
      handleTap(pos.x, pos.y, event.target);
    };

    const bindToCanvas = () => {
      const canvas = sceneEl.canvas || sceneEl.querySelector('canvas');
      if (!canvas || canvas.dataset.arPlacementBound) return false;

      canvas.dataset.arPlacementBound = '1';
      canvas.style.pointerEvents = 'auto';
      canvas.style.touchAction = 'none';

      const onTouchEnd = (event) => {
        if (event.cancelable) event.preventDefault();
        onUp(event);
      };

      canvas.addEventListener('mousedown', onDown);
      canvas.addEventListener('mouseup', onUp);
      canvas.addEventListener('touchstart', onDown, { passive: true });
      canvas.addEventListener('touchend', onTouchEnd, { passive: false });

      return true;
    };

    if (!bindToCanvas()) {
      const tryBind = () => bindToCanvas();
      sceneEl.addEventListener('loaded', tryBind, { once: true });
      sceneEl.addEventListener('renderstart', tryBind, { once: true });
      setTimeout(tryBind, 200);
      setTimeout(tryBind, 800);
      setTimeout(tryBind, 2000);
    }
  }
};

if (typeof window !== 'undefined') {
  window.AR3DHelper = AR3DHelper;
}
