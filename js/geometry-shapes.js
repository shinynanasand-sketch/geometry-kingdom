/**
 * 도형 생성 및 관리 시스템
 * Geometry Shapes Manager
 */

class GeometryShapes {
  /**
   * 도형 생성 메인 함수
   * @param {Object} config - 도형 설정 {type, color, size, animation, position, rotation}
   * @returns {HTMLElement} A-Frame 엔티티
   */
  static create(config) {
    const {
      type,
      color = '#4A90E2',
      size = 1,
      animation = true,
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 }
    } = config;

    let entity;

    switch (type) {
      case 'triangle':
        entity = this.createTriangle(color, size);
        break;
      case 'square':
        entity = this.createSquare(color, size);
        break;
      case 'rectangle':
        entity = this.createRectangle(color, size);
        break;
      case 'circle':
        entity = this.createCircle(color, size);
        break;
      case 'cube':
        entity = this.createCube(color, size);
        break;
      case 'sphere':
        entity = this.createSphere(color, size);
        break;
      case 'cylinder':
        entity = this.createCylinder(color, size);
        break;
      case 'cone':
        entity = this.createCone(color, size);
        break;
      case 'pyramid':
        entity = this.createPyramid(color, size);
        break;
      default:
        console.error(`Unknown shape type: ${type}`);
        return null;
    }

    if (!entity) return null;

    // 위치 설정
    entity.setAttribute('position', `${position.x} ${position.y} ${position.z}`);

    // 회전 설정
    entity.setAttribute('rotation', `${rotation.x} ${rotation.y} ${rotation.z}`);

    // 애니메이션 추가
    if (animation) {
      this.addRotationAnimation(entity);
    }

    return entity;
  }

  /**
   * 삼각형 생성 (2D)
   */
  static createTriangle(color, size) {
    const entity = document.createElement('a-entity');
    
    // 삼각형은 3개의 점으로 구성된 평면
    const vertices = [
      `${0 * size} ${0.866 * size} 0`,  // 위
      `${-0.5 * size} ${-0.433 * size} 0`,  // 왼쪽 아래
      `${0.5 * size} ${-0.433 * size} 0`   // 오른쪽 아래
    ].join(', ');

    entity.setAttribute('geometry', {
      primitive: 'triangle',
      vertexA: `0 ${0.866 * size} 0`,
      vertexB: `${-0.5 * size} ${-0.433 * size} 0`,
      vertexC: `${0.5 * size} ${-0.433 * size} 0`
    });

    entity.setAttribute('material', {
      color: color,
      side: 'double',
      shader: 'flat'
    });

    // 외곽선 추가
    this.addOutline(entity, color);

    return entity;
  }

  /**
   * 정사각형 생성 (2D)
   */
  static createSquare(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'plane',
      width: size,
      height: size
    });

    entity.setAttribute('material', {
      color: color,
      side: 'double',
      shader: 'flat'
    });

    this.addOutline(entity, color);

    return entity;
  }

  /**
   * 직사각형 생성 (2D)
   */
  static createRectangle(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'plane',
      width: size * 1.5,
      height: size
    });

    entity.setAttribute('material', {
      color: color,
      side: 'double',
      shader: 'flat'
    });

    this.addOutline(entity, color);

    return entity;
  }

  /**
   * 원 생성 (2D)
   */
  static createCircle(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'circle',
      radius: size * 0.5
    });

    entity.setAttribute('material', {
      color: color,
      side: 'double',
      shader: 'flat'
    });

    return entity;
  }

  /**
   * 정육면체 생성 (3D)
   */
  static createCube(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'box',
      width: size,
      height: size,
      depth: size
    });

    entity.setAttribute('material', {
      color: color,
      shader: 'standard',
      metalness: 0.2,
      roughness: 0.8
    });

    // 모서리 강조
    this.addEdges(entity, size);

    return entity;
  }

  /**
   * 구 생성 (3D)
   */
  static createSphere(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'sphere',
      radius: size * 0.5
    });

    entity.setAttribute('material', {
      color: color,
      shader: 'standard',
      metalness: 0.2,
      roughness: 0.8
    });

    return entity;
  }

  /**
   * 원기둥 생성 (3D)
   */
  static createCylinder(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: size * 0.4,
      height: size
    });

    entity.setAttribute('material', {
      color: color,
      shader: 'standard',
      metalness: 0.2,
      roughness: 0.8
    });

    return entity;
  }

  /**
   * 원뿔 생성 (3D)
   */
  static createCone(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'cone',
      radiusBottom: size * 0.4,
      radiusTop: 0,
      height: size
    });

    entity.setAttribute('material', {
      color: color,
      shader: 'standard',
      metalness: 0.2,
      roughness: 0.8
    });

    return entity;
  }

  /**
   * 피라미드(사각뿔) 생성 (3D)
   */
  static createPyramid(color, size) {
    const entity = document.createElement('a-entity');
    
    entity.setAttribute('geometry', {
      primitive: 'cone',
      radiusBottom: size * 0.5,
      radiusTop: 0,
      height: size,
      segmentsRadial: 4
    });

    entity.setAttribute('material', {
      color: color,
      shader: 'standard',
      metalness: 0.2,
      roughness: 0.8
    });

    return entity;
  }

  /**
   * 회전 애니메이션 추가
   */
  static addRotationAnimation(entity) {
    entity.setAttribute('animation', {
      property: 'rotation',
      to: '0 360 0',
      loop: true,
      dur: 8000,
      easing: 'linear'
    });
  }

  /**
   * 외곽선 추가 (2D 도형용)
   */
  static addOutline(entity, color) {
    // 외곽선은 약간 어두운 색으로
    const outlineColor = this.darkenColor(color, 0.3);
    
    // 외곽선 엔티티 생성 (약간 크게)
    const outline = document.createElement('a-entity');
    outline.setAttribute('geometry', entity.getAttribute('geometry'));
    outline.setAttribute('material', {
      color: outlineColor,
      side: 'double',
      shader: 'flat'
    });
    outline.setAttribute('scale', '1.05 1.05 1.05');
    outline.setAttribute('position', '0 0 -0.01');
    
    entity.appendChild(outline);
  }

  /**
   * 모서리 강조 (3D 도형용)
   */
  static addEdges(entity, size) {
    // 모서리 라인 추가 (선택사항)
    // A-Frame에서는 기본적으로 지원하지 않으므로 생략
    // 필요시 커스텀 컴포넌트로 구현
  }

  /**
   * 색상 어둡게 만들기
   */
  static darkenColor(color, amount) {
    // 간단한 색상 변환
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.max(0, Math.floor(r * (1 - amount)));
    const newG = Math.max(0, Math.floor(g * (1 - amount)));
    const newB = Math.max(0, Math.floor(b * (1 - amount)));

    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  }

  /**
   * 도형 정보 가져오기
   */
  static getShapeInfo(type) {
    const shapeData = {
      triangle: {
        name: '삼각형',
        nameEn: 'Triangle',
        sides: 3,
        vertices: 3,
        description: '변이 3개인 도형',
        color: '#FF6B6B'
      },
      square: {
        name: '정사각형',
        nameEn: 'Square',
        sides: 4,
        vertices: 4,
        description: '네 변의 길이가 같고, 네 각이 모두 직각인 도형',
        color: '#4A90E2'
      },
      rectangle: {
        name: '직사각형',
        nameEn: 'Rectangle',
        sides: 4,
        vertices: 4,
        description: '네 각이 모두 직각인 도형',
        color: '#51CF66'
      },
      circle: {
        name: '원',
        nameEn: 'Circle',
        sides: 0,
        vertices: 0,
        description: '한 점에서 같은 거리에 있는 점들의 모임',
        color: '#FFD43B'
      },
      cube: {
        name: '정육면체',
        nameEn: 'Cube',
        faces: 6,
        edges: 12,
        vertices: 8,
        description: '6개의 정사각형 면으로 이루어진 입체 도형',
        color: '#845EF7'
      },
      sphere: {
        name: '구',
        nameEn: 'Sphere',
        faces: 1,
        edges: 0,
        vertices: 0,
        description: '한 점에서 같은 거리에 있는 점들의 모임 (3D)',
        color: '#FF6B6B'
      },
      cylinder: {
        name: '원기둥',
        nameEn: 'Cylinder',
        faces: 3,
        edges: 2,
        vertices: 0,
        description: '두 개의 원과 하나의 곡면으로 이루어진 입체 도형',
        color: '#20C997'
      },
      cone: {
        name: '원뿔',
        nameEn: 'Cone',
        faces: 2,
        edges: 1,
        vertices: 1,
        description: '하나의 원과 하나의 곡면으로 이루어진 입체 도형',
        color: '#FF8787'
      },
      pyramid: {
        name: '사각뿔',
        nameEn: 'Pyramid',
        faces: 5,
        edges: 8,
        vertices: 5,
        description: '사각형 밑면과 4개의 삼각형 면으로 이루어진 입체 도형',
        color: '#FFA94D'
      }
    };

    return shapeData[type] || null;
  }

  /**
   * 도형에 라벨 추가
   */
  static addLabel(entity, text, position = { x: 0, y: 1.5, z: 0 }) {
    const label = document.createElement('a-text');
    label.setAttribute('value', text);
    label.setAttribute('align', 'center');
    label.setAttribute('color', '#000000');
    label.setAttribute('width', 3);
    label.setAttribute('position', `${position.x} ${position.y} ${position.z}`);
    label.setAttribute('look-at', '[camera]');
    
    entity.appendChild(label);
  }

  /**
   * 도형 크기 조절
   */
  static setScale(entity, scale) {
    entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
  }

  /**
   * 도형 색상 변경
   */
  static setColor(entity, color) {
    entity.setAttribute('material', 'color', color);
  }

  /**
   * 도형 제거
   */
  static remove(entity) {
    if (entity && entity.parentNode) {
      entity.parentNode.removeChild(entity);
    }
  }
}

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GeometryShapes;
}
