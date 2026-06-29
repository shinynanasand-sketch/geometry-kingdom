/**
 * AR Markerless Controller
 * 마커리스 AR 기능을 관리하는 컨트롤러
 * 
 * @author Cline AI Assistant
 * @version 1.0.0
 */

class ARMarkerlessController {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.shapesContainer = null;
    this.currentShape = null;
    this.shapes = [];
    this.isPlaneDetected = false;
    this.selectedShapeType = 'cube';
    this.rotationEnabled = false;
    this.scaleMode = false;
    this.levelData = null;
  }

  /**
   * 초기화
   * @param {number} levelId - 레벨 ID
   */
  async init(levelId = 3) {
    try {
      console.log('[AR Markerless] Initializing...');
      
      // A-Frame 씬 준비 대기
      await this.waitForScene();
      
      // 레벨 데이터 로드
      await this.loadLevelData(levelId);
      
      // 씬 요소 가져오기
      this.scene = document.querySelector('a-scene');
      this.camera = document.querySelector('[camera]');
      this.shapesContainer = document.getElementById('shapes-container');
      
      // 이벤트 리스너 등록
      this.registerEventListeners();
      
      // 평면 감지 시뮬레이션 (실제 AR.js NFT는 복잡하므로 간단한 구현)
      this.simulatePlaneDetection();
      
      console.log('[AR Markerless] Initialized successfully');

      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mode') !== 'create') {
        window.selectShape('cube');
      }
    } catch (error) {
      console.error('[AR Markerless] Initialization failed:', error);
      this.showError('AR 초기화에 실패했습니다.');
    }
  }

  /**
   * A-Frame 씬 로드 대기
   * @returns {Promise<void>}
   */
  waitForScene() {
    return new Promise((resolve) => {
      const scene = document.querySelector('a-scene');
      if (scene.hasLoaded) {
        resolve();
      } else {
        scene.addEventListener('loaded', () => resolve());
      }
    });
  }

  /**
   * 레벨 데이터 로드
   * @param {number} levelId - 레벨 ID
   */
  async loadLevelData(levelId) {
    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      this.levelData = data.levels.find(level => level.id === levelId);
      
      if (this.levelData) {
        // UI 업데이트
        document.getElementById('level-title').textContent = 
          `레벨 ${this.levelData.id}: ${this.levelData.name}`;
        document.getElementById('level-desc').textContent = 
          this.levelData.description;
      }
    } catch (error) {
      console.error('[AR Markerless] Failed to load level data:', error);
    }
  }

  /**
   * 이벤트 리스너 등록
   */
  registerEventListeners() {
    // 화면 터치/클릭으로 도형 배치
    this.scene.addEventListener('click', (event) => {
      if (this.isPlaneDetected && !this.scaleMode) {
        this.placeShape(event);
      }
    });

    // 도형 선택 이벤트
    window.selectShape = (shapeType) => {
      this.selectedShapeType = shapeType;
      this.updateShapeButtons(shapeType);
    };

    // 컨트롤 버튼 이벤트
    window.toggleRotation = () => this.toggleRotation();
    window.toggleScale = () => this.toggleScale();
    window.deleteShape = () => this.deleteCurrentShape();
    window.toggleShapeInfo = () => this.toggleShapeInfo();
    window.closeShapeInfo = () => {
      const infoPanel = document.getElementById('shape-info');
      if (infoPanel) infoPanel.style.display = 'none';
    };
  }

  /**
   * 평면 감지 시뮬레이션
   * 실제 AR.js NFT는 복잡하므로 간단한 타이머로 시뮬레이션
   */
  simulatePlaneDetection() {
    const statusEl = document.getElementById('plane-status');
    
    // 3초 후 평면 감지됨으로 표시
    setTimeout(() => {
      this.isPlaneDetected = true;
      statusEl.innerHTML = `
        <p>✅ 평면이 감지되었습니다!</p>
        <p class="hint">화면을 터치하여 도형을 배치하세요</p>
      `;
      statusEl.style.backgroundColor = 'rgba(81, 207, 102, 0.9)';
      
      // 5초 후 상태 메시지 숨김
      setTimeout(() => {
        statusEl.style.display = 'none';
      }, 5000);
    }, 3000);
  }

  /**
   * 도형 배치
   * @param {Event} event - 클릭/터치 이벤트
   */
  placeShape(event) {
    try {
      // 카메라 앞 위치 계산
      const cameraPosition = this.camera.getAttribute('position');
      const cameraRotation = this.camera.getAttribute('rotation');
      
      // 카메라 앞 2미터 위치에 배치
      const distance = 2;
      const radY = (cameraRotation.y * Math.PI) / 180;
      
      const position = {
        x: cameraPosition.x - Math.sin(radY) * distance,
        y: cameraPosition.y - 0.5, // 약간 아래
        z: cameraPosition.z - Math.cos(radY) * distance
      };

      // 도형 생성
      const shapeConfig = {
        type: this.selectedShapeType,
        color: this.getRandomColor(),
        size: 0.5,
        position: position,
        animation: true
      };

      const shapeEntity = GeometryShapes.create(shapeConfig);
      
      if (shapeEntity) {
        // 씬에 추가
        this.shapesContainer.appendChild(shapeEntity);
        
        // 도형 목록에 추가
        this.shapes.push({
          entity: shapeEntity,
          type: this.selectedShapeType,
          config: shapeConfig
        });
        
        // 현재 도형으로 설정
        this.currentShape = shapeEntity;
        
        // 도형 정보 업데이트
        this.updateShapeInfo(this.selectedShapeType);
        
        console.log('[AR Markerless] Shape placed:', this.selectedShapeType);
        
        // 피드백
        this.showToast(`${this.getShapeName(this.selectedShapeType)}을(를) 배치했습니다!`);
      }
    } catch (error) {
      console.error('[AR Markerless] Failed to place shape:', error);
      this.showError('도형 배치에 실패했습니다.');
    }
  }

  /**
   * 랜덤 색상 생성
   * @returns {string} Hex 색상
   */
  getRandomColor() {
    const colors = [
      '#FF6B6B', // 빨강
      '#4ECDC4', // 청록
      '#45B7D1', // 파랑
      '#FFA07A', // 주황
      '#98D8C8', // 민트
      '#F7DC6F', // 노랑
      '#BB8FCE', // 보라
      '#85C1E2'  // 하늘
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 도형 이름 가져오기
   * @param {string} type - 도형 타입
   * @returns {string} 도형 이름
   */
  getShapeName(type) {
    const names = {
      cube: '정육면체',
      sphere: '구',
      cylinder: '원기둥',
      cone: '원뿔',
      pyramid: '각뿔'
    };
    return names[type] || type;
  }

  /**
   * 도형 정보 업데이트
   * @param {string} shapeType - 도형 타입
   */
  updateShapeInfo(shapeType) {
    const info = GeometryShapes.getShapeInfo(shapeType);
    
    if (info) {
      document.getElementById('shape-name').textContent = info.name;
      document.getElementById('shape-faces').textContent = `${info.faces}개`;
      document.getElementById('shape-edges').textContent = `${info.edges}개`;
      document.getElementById('shape-vertices').textContent = `${info.vertices}개`;
      document.getElementById('shape-description').textContent = info.description;
      document.getElementById('shape-volume').textContent = info.volumeFormula || 'N/A';
    }
  }

  /**
   * 도형 버튼 업데이트
   * @param {string} shapeType - 선택된 도형 타입
   */
  updateShapeButtons(shapeType) {
    document.querySelectorAll('.shape-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    const selectedBtn = document.querySelector(`[data-shape="${shapeType}"]`);
    if (selectedBtn) {
      selectedBtn.classList.add('active');
    }
  }

  /**
   * 회전 토글
   */
  toggleRotation() {
    this.rotationEnabled = !this.rotationEnabled;
    
    if (this.currentShape) {
      const animation = this.currentShape.querySelector('[animation]');
      if (animation) {
        if (this.rotationEnabled) {
          animation.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 8000');
        } else {
          animation.removeAttribute('animation');
        }
      }
    }
    
    const btn = document.getElementById('btn-rotate');
    btn.classList.toggle('active', this.rotationEnabled);
    
    this.showToast(this.rotationEnabled ? '회전 활성화' : '회전 비활성화');
  }

  /**
   * 크기 조절 모드 토글
   */
  toggleScale() {
    this.scaleMode = !this.scaleMode;
    
    const btn = document.getElementById('btn-scale');
    btn.classList.toggle('active', this.scaleMode);
    
    if (this.scaleMode && this.currentShape) {
      this.showToast('도형을 터치하여 크기를 조절하세요');
      this.enableScaleGesture();
    } else {
      this.showToast('크기 조절 모드 종료');
      this.disableScaleGesture();
    }
  }

  /**
   * 크기 조절 제스처 활성화
   */
  enableScaleGesture() {
    if (!this.currentShape) return;
    
    let initialScale = this.currentShape.getAttribute('scale');
    let scaleValue = initialScale.x;
    
    // 간단한 더블 탭으로 크기 변경
    let tapCount = 0;
    const tapHandler = () => {
      tapCount++;
      if (tapCount === 1) {
        setTimeout(() => {
          if (tapCount === 2) {
            // 더블 탭: 크기 증가
            scaleValue = Math.min(scaleValue + 0.2, 2.0);
          } else {
            // 싱글 탭: 크기 감소
            scaleValue = Math.max(scaleValue - 0.2, 0.3);
          }
          
          this.currentShape.setAttribute('scale', {
            x: scaleValue,
            y: scaleValue,
            z: scaleValue
          });
          
          tapCount = 0;
        }, 300);
      }
    };
    
    this.currentShape.addEventListener('click', tapHandler);
    this.scaleGestureHandler = tapHandler;
  }

  /**
   * 크기 조절 제스처 비활성화
   */
  disableScaleGesture() {
    if (this.currentShape && this.scaleGestureHandler) {
      this.currentShape.removeEventListener('click', this.scaleGestureHandler);
      this.scaleGestureHandler = null;
    }
  }

  /**
   * 현재 도형 삭제
   */
  deleteCurrentShape() {
    if (this.currentShape) {
      const shapeName = this.getShapeName(this.selectedShapeType);
      
      // 씬에서 제거
      this.shapesContainer.removeChild(this.currentShape);
      
      // 목록에서 제거
      this.shapes = this.shapes.filter(s => s.entity !== this.currentShape);
      
      this.currentShape = null;
      
      this.showToast(`${shapeName}을(를) 삭제했습니다`);
    } else {
      this.showToast('삭제할 도형이 없습니다');
    }
  }

  /**
   * 도형 정보 패널 토글
   */
  toggleShapeInfo() {
    const infoPanel = document.getElementById('shape-info');
    const isVisible = infoPanel.style.display !== 'none';
    
    if (isVisible) {
      infoPanel.style.display = 'none';
    } else {
      if (this.currentShape) {
        this.updateShapeInfo(this.selectedShapeType);
        infoPanel.style.display = 'block';
      } else {
        this.showToast('먼저 도형을 배치해주세요');
      }
    }
  }

  /**
   * 토스트 메시지 표시
   * @param {string} message - 메시지
   */
  showToast(message) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
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
    `;
    
    document.body.appendChild(toast);
    
    // 2초 후 제거
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  /**
   * 에러 메시지 표시
   * @param {string} message - 에러 메시지
   */
  showError(message) {
    alert(message);
  }

  /**
   * 모든 도형 제거
   */
  clearAllShapes() {
    this.shapes.forEach(shape => {
      this.shapesContainer.removeChild(shape.entity);
    });
    this.shapes = [];
    this.currentShape = null;
    this.showToast('모든 도형을 제거했습니다');
  }

  /**
   * 진행도 저장
   */
  saveProgress() {
    if (!this.levelData) return;

    if (typeof ProgressTracker !== 'undefined') {
      const progress = ProgressTracker.getProgress();
      if (!progress.arSessions) {
        progress.arSessions = {};
      }
      progress.arSessions[this.levelData.id] = {
        shapesPlaced: this.shapes.length,
        timestamp: Date.now()
      };
      ProgressTracker.saveProgress(progress);
      console.log('[AR Markerless] Progress saved via ProgressTracker');
    }
  }
}

// 전역 인스턴스 생성
const arController = new ARMarkerlessController();

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', async () => {
  // URL 파라미터에서 레벨 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const levelId = parseInt(urlParams.get('level')) || 3;
  
  // 초기화
  await arController.init(levelId);
});

// 페이지 언로드 시 진행도 저장
window.addEventListener('beforeunload', () => {
  arController.saveProgress();
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(-50%) translateY(20px); }
    10% { opacity: 1; transform: translateX(-50%) translateY(0); }
    90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
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
