/**
 * Shape Builder
 * 도형 창작 시스템 - 오일러 공식 검증
 * 
 * @author Cline AI Assistant
 * @version 1.0.0
 */

class ShapeBuilder {
  constructor() {
    this.parts = [];
    this.vertices = 0;
    this.edges = 0;
    this.faces = 0;
    this.scene = null;
    this.container = null;
  }

  /**
   * 초기화
   */
  init() {
    this.scene = document.querySelector('a-scene');
    this.container = document.getElementById('shapes-container');
    console.log('[Shape Builder] Initialized');
  }

  /**
   * 부품 추가
   * @param {string} partType - 부품 타입 (triangle, square, pentagon, hexagon, circle)
   */
  addPart(partType) {
    const partData = this.getPartData(partType);
    
    if (!partData) {
      console.error('[Shape Builder] Invalid part type:', partType);
      return;
    }

    // 부품 생성
    const part = {
      type: partType,
      vertices: partData.vertices,
      edges: partData.edges,
      faces: 1, // 각 부품은 1개의 면
      entity: this.createPartEntity(partType)
    };

    this.parts.push(part);
    
    // 씬에 추가
    if (this.container && part.entity) {
      this.container.appendChild(part.entity);
    }

    // 통계 업데이트
    this.updateStatistics();
    
    console.log('[Shape Builder] Part added:', partType);
    this.showToast(`${partData.name} 추가됨`);
  }

  /**
   * 부품 데이터 가져오기
   * @param {string} partType - 부품 타입
   * @returns {Object|null} 부품 데이터
   */
  getPartData(partType) {
    const parts = {
      triangle: {
        name: '삼각형',
        vertices: 3,
        edges: 3
      },
      square: {
        name: '사각형',
        vertices: 4,
        edges: 4
      },
      pentagon: {
        name: '오각형',
        vertices: 5,
        edges: 5
      },
      hexagon: {
        name: '육각형',
        vertices: 6,
        edges: 6
      },
      circle: {
        name: '원',
        vertices: 0, // 원은 무한대 꼭짓점으로 간주하지만 여기서는 0
        edges: 0
      }
    };

    return parts[partType] || null;
  }

  /**
   * 부품 엔티티 생성
   * @param {string} partType - 부품 타입
   * @returns {HTMLElement} A-Frame 엔티티
   */
  createPartEntity(partType) {
    const entity = document.createElement('a-entity');
    
    // 랜덤 위치 (카메라 앞)
    const x = (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = -3 + (Math.random() - 0.5);
    
    entity.setAttribute('position', `${x} ${y} ${z}`);
    
    // 도형에 따라 geometry 설정
    switch (partType) {
      case 'triangle':
        entity.setAttribute('geometry', {
          primitive: 'cone',
          radiusBottom: 0.3,
          radiusTop: 0,
          height: 0.5,
          segmentsRadial: 3
        });
        break;
      case 'square':
        entity.setAttribute('geometry', {
          primitive: 'box',
          width: 0.4,
          height: 0.4,
          depth: 0.05
        });
        break;
      case 'pentagon':
        entity.setAttribute('geometry', {
          primitive: 'cylinder',
          radius: 0.3,
          height: 0.05,
          segmentsRadial: 5
        });
        break;
      case 'hexagon':
        entity.setAttribute('geometry', {
          primitive: 'cylinder',
          radius: 0.3,
          height: 0.05,
          segmentsRadial: 6
        });
        break;
      case 'circle':
        entity.setAttribute('geometry', {
          primitive: 'circle',
          radius: 0.3
        });
        break;
    }
    
    // 재질 설정
    const color = this.getRandomColor();
    entity.setAttribute('material', {
      color: color,
      shader: 'flat'
    });
    
    // 회전 애니메이션
    entity.setAttribute('animation', {
      property: 'rotation',
      to: '0 360 0',
      loop: true,
      dur: 10000
    });
    
    return entity;
  }

  /**
   * 랜덤 색상 생성
   * @returns {string} Hex 색상
   */
  getRandomColor() {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 통계 업데이트
   */
  updateStatistics() {
    // 모든 부품의 꼭짓점, 모서리, 면 합산
    this.vertices = this.parts.reduce((sum, part) => sum + part.vertices, 0);
    this.edges = this.parts.reduce((sum, part) => sum + part.edges, 0);
    this.faces = this.parts.length; // 각 부품이 1개의 면
    
    console.log('[Shape Builder] Statistics:', {
      vertices: this.vertices,
      edges: this.edges,
      faces: this.faces
    });
  }

  /**
   * 오일러 공식 검증
   * V - E + F = 2 (다면체의 경우)
   * @returns {Object} 검증 결과
   */
  validateEulerFormula() {
    this.updateStatistics();
    
    const eulerResult = this.vertices - this.edges + this.faces;
    const isValid = eulerResult === 2;
    
    const result = {
      vertices: this.vertices,
      edges: this.edges,
      faces: this.faces,
      eulerResult: eulerResult,
      isValid: isValid,
      message: this.getValidationMessage(eulerResult, isValid)
    };
    
    console.log('[Shape Builder] Euler validation:', result);
    return result;
  }

  /**
   * 검증 메시지 생성
   * @param {number} eulerResult - 오일러 공식 결과
   * @param {boolean} isValid - 유효성
   * @returns {string} 메시지
   */
  getValidationMessage(eulerResult, isValid) {
    if (this.parts.length === 0) {
      return '부품을 추가해주세요!';
    }
    
    if (isValid) {
      return '✅ 완벽합니다! 이 도형은 오일러 공식을 만족하는 다면체입니다!';
    } else if (eulerResult < 2) {
      return `❌ 아직 완성되지 않았어요. 면이나 꼭짓점을 더 추가해보세요! (현재: ${eulerResult})`;
    } else {
      return `❌ 도형이 너무 복잡해요. 일부 부품을 제거해보세요! (현재: ${eulerResult})`;
    }
  }

  /**
   * 정다면체 확인
   * @returns {string|null} 정다면체 이름 또는 null
   */
  checkPlatonicSolid() {
    const { vertices, edges, faces } = this;
    
    // 정다면체 5종
    const platonicSolids = [
      { name: '정사면체', v: 4, e: 6, f: 4 },
      { name: '정육면체', v: 8, e: 12, f: 6 },
      { name: '정팔면체', v: 6, e: 12, f: 8 },
      { name: '정십이면체', v: 20, e: 30, f: 12 },
      { name: '정이십면체', v: 12, e: 30, f: 20 }
    ];
    
    for (const solid of platonicSolids) {
      if (solid.v === vertices && solid.e === edges && solid.f === faces) {
        return solid.name;
      }
    }
    
    return null;
  }

  /**
   * UI 업데이트
   */
  updateUI() {
    const result = this.validateEulerFormula();
    
    // 통계 표시
    document.getElementById('v-count').textContent = result.vertices;
    document.getElementById('e-count').textContent = result.edges;
    document.getElementById('f-count').textContent = result.faces;
    document.getElementById('euler-result').textContent = result.eulerResult;
    document.getElementById('result-message').textContent = result.message;
    
    // 결과 패널 표시
    const validationResult = document.getElementById('validation-result');
    validationResult.style.display = 'block';
    
    // 정다면체 확인
    const platonicSolid = this.checkPlatonicSolid();
    if (platonicSolid) {
      const bonus = document.createElement('p');
      bonus.className = 'bonus-message';
      bonus.textContent = `🎉 축하합니다! ${platonicSolid}를 만들었습니다!`;
      bonus.style.cssText = `
        color: #51cf66;
        font-weight: bold;
        margin-top: 10px;
        animation: pulse 1s infinite;
      `;
      validationResult.appendChild(bonus);
    }
    
    // 색상 변경
    if (result.isValid) {
      validationResult.style.borderColor = '#51cf66';
      validationResult.style.backgroundColor = 'rgba(81, 207, 102, 0.1)';
    } else {
      validationResult.style.borderColor = '#ff6b6b';
      validationResult.style.backgroundColor = 'rgba(255, 107, 107, 0.1)';
    }
  }

  /**
   * 모든 부품 제거
   */
  clearAll() {
    this.parts.forEach(part => {
      if (part.entity && this.container) {
        this.container.removeChild(part.entity);
      }
    });
    
    this.parts = [];
    this.vertices = 0;
    this.edges = 0;
    this.faces = 0;
    
    // UI 초기화
    document.getElementById('validation-result').style.display = 'none';
    
    this.showToast('모든 부품을 제거했습니다');
    console.log('[Shape Builder] All parts cleared');
  }

  /**
   * 마지막 부품 제거
   */
  removeLast() {
    if (this.parts.length === 0) {
      this.showToast('제거할 부품이 없습니다');
      return;
    }
    
    const lastPart = this.parts.pop();
    
    if (lastPart.entity && this.container) {
      this.container.removeChild(lastPart.entity);
    }
    
    this.updateStatistics();
    this.showToast('마지막 부품을 제거했습니다');
  }

  /**
   * 토스트 메시지 표시
   * @param {string} message - 메시지
   */
  showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
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
    
    setTimeout(() => {
      toast.remove();
    }, 2000);
  }

  /**
   * 도형 저장
   * @returns {Object} 저장된 도형 데이터
   */
  saveShape() {
    const shapeData = {
      parts: this.parts.map(p => ({
        type: p.type,
        vertices: p.vertices,
        edges: p.edges,
        faces: p.faces
      })),
      statistics: {
        vertices: this.vertices,
        edges: this.edges,
        faces: this.faces
      },
      validation: this.validateEulerFormula(),
      timestamp: Date.now()
    };
    
    // LocalStorage에 저장
    const savedShapes = JSON.parse(localStorage.getItem('created-shapes') || '[]');
    savedShapes.push(shapeData);
    localStorage.setItem('created-shapes', JSON.stringify(savedShapes));
    
    console.log('[Shape Builder] Shape saved:', shapeData);
    this.showToast('도형이 저장되었습니다!');
    
    return shapeData;
  }

  /**
   * 저장된 도형 불러오기
   * @returns {Array} 저장된 도형 목록
   */
  loadSavedShapes() {
    const savedShapes = JSON.parse(localStorage.getItem('created-shapes') || '[]');
    console.log('[Shape Builder] Loaded shapes:', savedShapes.length);
    return savedShapes;
  }
}

// 전역 인스턴스
const shapeBuilder = new ShapeBuilder();

// 전역 함수 (HTML에서 호출)
window.addPart = function() {
  const partType = document.getElementById('part-select').value;
  shapeBuilder.addPart(partType);
};

window.validateShape = function() {
  shapeBuilder.updateUI();
};

window.clearAllParts = function() {
  shapeBuilder.clearAll();
};

window.removeLastPart = function() {
  shapeBuilder.removeLast();
};

window.saveCreatedShape = function() {
  shapeBuilder.saveShape();
};

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
  // 창작 모드일 때만 초기화
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('mode') === 'create') {
    shapeBuilder.init();
    console.log('[Shape Builder] Create mode activated');
  }
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .validation-result {
    border: 2px solid #ddd;
    border-radius: 12px;
    padding: 16px;
    margin-top: 16px;
    transition: all 0.3s ease;
  }
  
  .validation-result h4 {
    margin-top: 0;
    color: #333;
  }
  
  .validation-result p {
    margin: 8px 0;
  }
  
  .validation-result .formula {
    font-size: 18px;
    font-weight: bold;
    color: #667eea;
    margin: 12px 0;
  }
  
  .validation-result .result-message {
    font-size: 16px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.5);
  }
`;
document.head.appendChild(style);
