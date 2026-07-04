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
      case 'rightTriangle':
        entity = this.createRightTriangle(color, size);
        break;
      case 'isoscelesTriangle':
        entity = this.createIsoscelesTriangle(color, size);
        break;
      case 'quad':
      case 'square':
        entity = this.createSquare(color, size);
        break;
      case 'rectangle':
        entity = this.createRectangle(color, size);
        break;
      case 'rhombus':
        entity = this.createRhombus(color, size);
        break;
      case 'parallelogram':
        entity = this.createParallelogram(color, size);
        break;
      case 'trapezoid':
        entity = this.createTrapezoid(color, size);
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
      case 'box':
        entity = this.createBox(color, size);
        break;
      case 'prism':
        entity = this.createPrism(color, size);
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
   * 2D 다각형 (삼각형 팬으로 구성)
   * @param {Array<{x:number,y:number}>} points
   */
  static createPolygon(color, size, points) {
    const entity = document.createElement('a-entity');
    const scaled = points.map((p) => ({ x: p.x * size, y: p.y * size }));

    for (let i = 1; i < scaled.length - 1; i++) {
      const tri = document.createElement('a-entity');
      tri.setAttribute('geometry', {
        primitive: 'triangle',
        vertexA: `${scaled[0].x} ${scaled[0].y} 0`,
        vertexB: `${scaled[i].x} ${scaled[i].y} 0`,
        vertexC: `${scaled[i + 1].x} ${scaled[i + 1].y} 0`
      });
      tri.setAttribute('material', {
        color,
        side: 'double',
        shader: 'flat'
      });
      entity.appendChild(tri);
    }

    return entity;
  }

  /** 직각삼각형 */
  static createRightTriangle(color, size) {
    return this.createPolygon(color, size, [
      { x: -0.5, y: -0.4 },
      { x: 0.5, y: -0.4 },
      { x: -0.5, y: 0.5 }
    ]);
  }

  /** 이등변삼각형 */
  static createIsoscelesTriangle(color, size) {
    return this.createPolygon(color, size, [
      { x: 0, y: 0.55 },
      { x: -0.55, y: -0.4 },
      { x: 0.55, y: -0.4 }
    ]);
  }

  /** 마름모 */
  static createRhombus(color, size) {
    return this.createPolygon(color, size, [
      { x: 0, y: 0.55 },
      { x: 0.45, y: 0 },
      { x: 0, y: -0.55 },
      { x: -0.45, y: 0 }
    ]);
  }

  /** 평행사변형 */
  static createParallelogram(color, size) {
    return this.createPolygon(color, size, [
      { x: -0.55, y: -0.35 },
      { x: 0.35, y: -0.35 },
      { x: 0.55, y: 0.35 },
      { x: -0.35, y: 0.35 }
    ]);
  }

  /** 사다리꼴 */
  static createTrapezoid(color, size) {
    return this.createPolygon(color, size, [
      { x: -0.3, y: 0.4 },
      { x: 0.3, y: 0.4 },
      { x: 0.55, y: -0.4 },
      { x: -0.55, y: -0.4 }
    ]);
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
   * 직육면체 생성 (3D)
   */
  static createBox(color, size) {
    const entity = document.createElement('a-entity');

    entity.setAttribute('geometry', {
      primitive: 'box',
      width: size * 1.5,
      height: size * 0.8,
      depth: size
    });

    entity.setAttribute('material', {
      color: color,
      shader: 'standard',
      metalness: 0.2,
      roughness: 0.8
    });

    this.addEdges(entity, size);
    return entity;
  }

  /**
   * 육각기둥 생성 (3D)
   */
  static createPrism(color, size) {
    const entity = document.createElement('a-entity');

    entity.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: size * 0.45,
      height: size,
      segmentsRadial: 6
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
    const wireframe = document.createElement('a-entity');
    wireframe.setAttribute('geometry', entity.getAttribute('geometry'));
    wireframe.setAttribute('material', {
      color: '#333',
      wireframe: true,
      shader: 'flat'
    });
    wireframe.setAttribute('scale', '1.002 1.002 1.002');
    wireframe.classList.add('edge-highlight');
    wireframe.setAttribute('visible', 'false');
    entity.appendChild(wireframe);
    entity.edgeHighlight = wireframe;
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
        areaFormula: '밑변 × 높이 ÷ 2',
        color: '#FF6B6B'
      },
      rightTriangle: {
        name: '직각삼각형',
        nameEn: 'Right Triangle',
        sides: 3,
        vertices: 3,
        description: '한 각이 직각(90°)인 삼각형',
        areaFormula: '밑변 × 높이 ÷ 2',
        color: '#FF8787'
      },
      isoscelesTriangle: {
        name: '이등변삼각형',
        nameEn: 'Isosceles Triangle',
        sides: 3,
        vertices: 3,
        description: '두 변의 길이가 같은 삼각형',
        areaFormula: '밑변 × 높이 ÷ 2',
        color: '#FFA8A8'
      },
      quad: {
        name: '사각형',
        nameEn: 'Quadrilateral',
        sides: 4,
        vertices: 4,
        description: '변이 4개인 기본 도형',
        areaFormula: '모양에 따라 다름',
        color: '#4A90E2'
      },
      square: {
        name: '정사각형',
        nameEn: 'Square',
        sides: 4,
        vertices: 4,
        description: '네 변의 길이가 같고, 네 각이 모두 직각인 사각형',
        areaFormula: '한 변 × 한 변',
        color: '#4A90E2'
      },
      rectangle: {
        name: '직사각형',
        nameEn: 'Rectangle',
        sides: 4,
        vertices: 4,
        description: '네 각이 모두 직각이고, 마주 보는 변의 길이가 같은 도형',
        areaFormula: '가로 × 세로',
        color: '#51CF66'
      },
      rhombus: {
        name: '마름모',
        nameEn: 'Rhombus',
        sides: 4,
        vertices: 4,
        description: '네 변의 길이가 모두 같은 사각형',
        areaFormula: '대각선 × 대각선 ÷ 2',
        color: '#845EF7'
      },
      parallelogram: {
        name: '평행사변형',
        nameEn: 'Parallelogram',
        sides: 4,
        vertices: 4,
        description: '마주 보는 두 쌍의 변이 각각 평행한 사각형',
        areaFormula: '밑변 × 높이',
        color: '#20C997'
      },
      trapezoid: {
        name: '사다리꼴',
        nameEn: 'Trapezoid',
        sides: 4,
        vertices: 4,
        description: '한 쌍의 대변이 평행한 사각형',
        areaFormula: '(윗변 + 아랫변) × 높이 ÷ 2',
        color: '#FF922B'
      },
      circle: {
        name: '원',
        nameEn: 'Circle',
        sides: 0,
        vertices: 0,
        description: '한 점에서 같은 거리에 있는 점들의 모임',
        areaFormula: 'π × 반지름²',
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
        volumeFormula: '⅓ × 밑넓이 × 높이',
        color: '#FFA94D'
      },
      box: {
        name: '직육면체',
        nameEn: 'Rectangular Prism',
        faces: 6,
        edges: 12,
        vertices: 8,
        description: '6개의 직사각형 면으로 이루어진 입체 도형',
        volumeFormula: '가로 × 세로 × 높이',
        color: '#51CF66'
      },
      prism: {
        name: '육각기둥',
        nameEn: 'Hexagonal Prism',
        faces: 8,
        edges: 18,
        vertices: 12,
        description: '육각형 밑면과 직사각형 옆면으로 이루어진 각기둥',
        volumeFormula: '밑넓이 × 높이',
        color: '#339AF0'
      }
    };

    const info = shapeData[type];
    if (info && !info.volumeFormula) {
      const formulas = {
        cube: 'a³',
        sphere: '⁴⁄₃πr³',
        cylinder: 'πr²h',
        cone: '⅓πr²h'
      };
      info.volumeFormula = formulas[type] || 'N/A';
    }

    return info || null;
  }

  /**
   * 면/모서리/꼭짓점 강조
   */
  static highlightProperties(entity, mode, shapeType) {
    this.clearHighlights(entity);

    if (!entity || mode === 'none') return;

    const highlightContainer = document.createElement('a-entity');
    highlightContainer.classList.add('highlight-overlay');
    entity.appendChild(highlightContainer);
    entity.highlightOverlay = highlightContainer;

    const size = 0.5;
    const markerColor = { face: '#FFD43B', edge: '#FF6B6B', vertex: '#4ECDC4' };

    if (mode === 'vertices') {
      const offsets = this.getVertexOffsets(shapeType, size);
      offsets.forEach((pos) => {
        const marker = document.createElement('a-sphere');
        marker.setAttribute('radius', 0.06);
        marker.setAttribute('color', markerColor.vertex);
        marker.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
        highlightContainer.appendChild(marker);
      });
    }

    if (mode === 'edges' && entity.edgeHighlight) {
      entity.edgeHighlight.setAttribute('visible', 'true');
    }

    if (mode === 'faces') {
      const faces = this.getFacePlanes(shapeType, size);
      faces.forEach((face) => {
        const plane = document.createElement('a-plane');
        plane.setAttribute('width', face.width);
        plane.setAttribute('height', face.height);
        plane.setAttribute('position', `${face.pos.x} ${face.pos.y} ${face.pos.z}`);
        plane.setAttribute('rotation', face.rotation);
        plane.setAttribute('material', {
          color: markerColor.face,
          opacity: 0.35,
          transparent: true,
          side: 'double'
        });
        highlightContainer.appendChild(plane);
      });
    }
  }

  static clearHighlights(entity) {
    if (entity?.highlightOverlay) {
      entity.removeChild(entity.highlightOverlay);
      entity.highlightOverlay = null;
    }
    if (entity?.edgeHighlight) {
      entity.edgeHighlight.setAttribute('visible', 'false');
    }
  }

  static getVertexOffsets(shapeType, size) {
    const h = size * 0.5;
    const offsets = {
      cube: [
        { x: -h, y: -h, z: -h }, { x: h, y: -h, z: -h },
        { x: -h, y: h, z: -h }, { x: h, y: h, z: -h },
        { x: -h, y: -h, z: h }, { x: h, y: -h, z: h },
        { x: -h, y: h, z: h }, { x: h, y: h, z: h }
      ],
      box: [
        { x: -h * 1.5, y: -h * 0.8, z: -h }, { x: h * 1.5, y: -h * 0.8, z: -h },
        { x: -h * 1.5, y: h * 0.8, z: -h }, { x: h * 1.5, y: h * 0.8, z: -h },
        { x: -h * 1.5, y: -h * 0.8, z: h }, { x: h * 1.5, y: -h * 0.8, z: h },
        { x: -h * 1.5, y: h * 0.8, z: h }, { x: h * 1.5, y: h * 0.8, z: h }
      ],
      pyramid: [
        { x: -h, y: -h * 0.5, z: -h }, { x: h, y: -h * 0.5, z: -h },
        { x: h, y: -h * 0.5, z: h }, { x: -h, y: -h * 0.5, z: h },
        { x: 0, y: h * 0.5, z: 0 }
      ],
      cone: [{ x: 0, y: h * 0.5, z: 0 }, { x: 0, y: -h * 0.5, z: 0 }]
    };
    return offsets[shapeType] || [{ x: 0, y: h, z: 0 }, { x: 0, y: -h, z: 0 }];
  }

  static getFacePlanes(shapeType, size) {
    const h = size * 0.5;
    if (shapeType === 'cube' || shapeType === 'box') {
      const w = shapeType === 'box' ? h * 1.5 : h;
      const bh = shapeType === 'box' ? h * 0.8 : h;
      return [
        { width: w * 2, height: bh * 2, pos: { x: 0, y: 0, z: h }, rotation: '0 0 0' },
        { width: w * 2, height: bh * 2, pos: { x: 0, y: 0, z: -h }, rotation: '0 180 0' },
        { width: h * 2, height: bh * 2, pos: { x: w, y: 0, z: 0 }, rotation: '0 90 0' },
        { width: h * 2, height: bh * 2, pos: { x: -w, y: 0, z: 0 }, rotation: '0 -90 0' },
        { width: w * 2, height: h * 2, pos: { x: 0, y: bh, z: 0 }, rotation: '-90 0 0' },
        { width: w * 2, height: h * 2, pos: { x: 0, y: -bh, z: 0 }, rotation: '90 0 0' }
      ];
    }
    return [{ width: size, height: size, pos: { x: 0, y: 0, z: h }, rotation: '0 0 0' }];
  }

  /**
   * 전개도 애니메이션 토글
   */
  static toggleUnfold(entity, shapeType, unfolded) {
    if (!entity) return;

    let unfoldGroup = entity.querySelector('.unfold-group');

    if (!unfolded) {
      if (unfoldGroup) {
        unfoldGroup.setAttribute('animation', {
          property: 'scale',
          to: '0 0 0',
          dur: 400,
          easing: 'easeInQuad'
        });
        setTimeout(() => {
          if (unfoldGroup.parentNode) unfoldGroup.parentNode.removeChild(unfoldGroup);
        }, 400);
      }
      entity.setAttribute('visible', 'true');
      return;
    }

    entity.setAttribute('visible', 'false');

    unfoldGroup = document.createElement('a-entity');
    unfoldGroup.classList.add('unfold-group');
    entity.parentNode.appendChild(unfoldGroup);
    unfoldGroup.setAttribute('position', entity.getAttribute('position'));
    unfoldGroup.setAttribute('rotation', entity.getAttribute('rotation'));

    const size = 0.5;
    const faces = this.getUnfoldLayout(shapeType, size);
    faces.forEach((face, i) => {
      const plane = document.createElement('a-plane');
      plane.setAttribute('width', face.width);
      plane.setAttribute('height', face.height);
      plane.setAttribute('position', `${face.start.x} ${face.start.y} ${face.start.z}`);
      plane.setAttribute('rotation', face.rotation);
      plane.setAttribute('material', {
        color: face.color,
        side: 'double',
        shader: 'flat',
        opacity: 0.9
      });
      plane.setAttribute('animation', {
        property: 'position',
        to: `${face.end.x} ${face.end.y} ${face.end.z}`,
        dur: 1200,
        delay: i * 150,
        easing: 'easeOutElastic'
      });
      unfoldGroup.appendChild(plane);
    });

    entity.unfoldGroup = unfoldGroup;
  }

  static getUnfoldLayout(shapeType, size) {
    const h = size;
    const color = '#845EF7';

    if (shapeType === 'cube' || shapeType === 'box') {
      return [
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, rotation: '0 0 0', color },
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: -h, y: 0, z: 0 }, rotation: '0 0 0', color: '#667eea' },
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: h, y: 0, z: 0 }, rotation: '0 0 0', color: '#764ba2' },
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: h, z: 0 }, rotation: '0 0 0', color: '#4ECDC4' },
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: -h, z: 0 }, rotation: '0 0 0', color: '#FF6B6B' },
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: -h }, rotation: '0 0 0', color: '#FFD43B' }
      ];
    }

    if (shapeType === 'pyramid') {
      return [
        { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, rotation: '0 0 0', color: '#FFA94D' },
        { width: h, height: h * 0.8, start: { x: 0, y: 0, z: 0 }, end: { x: -h * 0.6, y: h * 0.3, z: 0 }, rotation: '0 0 0', color: '#FF8787' },
        { width: h, height: h * 0.8, start: { x: 0, y: 0, z: 0 }, end: { x: h * 0.6, y: h * 0.3, z: 0 }, rotation: '0 0 0', color: '#FF6B6B' },
        { width: h, height: h * 0.8, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: h * 0.3, z: -h * 0.6 }, rotation: '0 0 0', color: '#FFD43B' },
        { width: h, height: h * 0.8, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: h * 0.3, z: h * 0.6 }, rotation: '0 0 0', color: '#51CF66' }
      ];
    }

    return [
      { width: h, height: h, start: { x: 0, y: 0, z: 0 }, end: { x: 0, y: 0, z: 0 }, rotation: '0 0 0', color }
    ];
  }

  /**
   * 단면 보기 토글
   */
  static toggleCrossSection(entity, enabled) {
    if (!entity) return;

    let section = entity.querySelector('.cross-section');
    if (!enabled) {
      entity.setAttribute('material', 'opacity', 1);
      entity.setAttribute('material', 'transparent', false);
      if (section) section.setAttribute('visible', 'false');
      return;
    }

    entity.setAttribute('material', 'opacity', 0.55);
    entity.setAttribute('material', 'transparent', true);

    if (!section) {
      section = document.createElement('a-ring');
      section.classList.add('cross-section');
      section.setAttribute('radius-inner', 0.35);
      section.setAttribute('radius-outer', 0.42);
      section.setAttribute('rotation', '-90 0 0');
      section.setAttribute('position', '0 0 0');
      section.setAttribute('color', '#FF6B6B');
      entity.appendChild(section);
    }
    section.setAttribute('visible', 'true');
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
