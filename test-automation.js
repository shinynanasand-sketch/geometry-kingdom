/**
 * Automated Test Script
 * 자동 테스트 스크립트 - 정적 분석 및 구문 검증
 * 
 * 실행: node test-automation.js
 */

const fs = require('fs');
const path = require('path');

// 색상 출력 (콘솔)
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 테스트 결과 저장
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  errors: []
};

/**
 * 테스트 시작
 */
console.log(`${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.cyan}   자동 테스트 시작${colors.reset}`);
console.log(`${colors.cyan}========================================${colors.reset}\n`);

/**
 * 1. 파일 존재 확인 테스트
 */
console.log(`${colors.blue}[1] 파일 존재 확인 테스트${colors.reset}`);

const requiredFiles = [
  // HTML 파일
  'index.html',
  'ar-marker.html',
  'ar-markerless.html',
  'quiz.html',
  'progress.html',
  'shop.html',
  'collection.html',
  'minigames.html',
  'juryeonggu.html',
  
  // CSS 파일
  'css/style.css',
  'css/ar-ui.css',
  
  // JavaScript 파일
  'js/app.js',
  'js/utils.js',
  'js/progress-tracker.js',
  'js/geometry-shapes.js',
  'js/ar-marker.js',
  'js/ar-markerless.js',
  'js/shape-builder.js',
  
  // 데이터 파일
  'data/levels.json',
  
  // 문서 파일
  'docs/PRD.md',
  'docs/SRS.md',
  'docs/TRD.md',
  'docs/TEST_REPORT.md'
];

requiredFiles.forEach(file => {
  testResults.total++;
  if (fs.existsSync(file)) {
    console.log(`${colors.green}✓${colors.reset} ${file}`);
    testResults.passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${file} - 파일 없음`);
    testResults.failed++;
    testResults.errors.push(`파일 없음: ${file}`);
  }
});

console.log('');

/**
 * 2. JSON 유효성 검증
 */
console.log(`${colors.blue}[2] JSON 유효성 검증${colors.reset}`);

const jsonFiles = [
  'data/levels.json'
];

jsonFiles.forEach(file => {
  testResults.total++;
  try {
    const content = fs.readFileSync(file, 'utf8');
    JSON.parse(content);
    console.log(`${colors.green}✓${colors.reset} ${file} - 유효한 JSON`);
    testResults.passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${file} - JSON 파싱 오류: ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`JSON 오류 (${file}): ${error.message}`);
  }
});

console.log('');

/**
 * 3. JavaScript 구문 검증 (간단한 체크)
 */
console.log(`${colors.blue}[3] JavaScript 구문 검증${colors.reset}`);

const jsFiles = [
  'js/app.js',
  'js/utils.js',
  'js/progress-tracker.js',
  'js/geometry-shapes.js',
  'js/ar-marker.js',
  'js/ar-markerless.js',
  'js/shape-builder.js'
];

jsFiles.forEach(file => {
  testResults.total++;
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // 기본적인 구문 체크 (괄호 매칭)
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    
    if (openBraces !== closeBraces) {
      throw new Error(`중괄호 불일치: { ${openBraces}개, } ${closeBraces}개`);
    }
    if (openParens !== closeParens) {
      throw new Error(`소괄호 불일치: ( ${openParens}개, ) ${closeParens}개`);
    }
    
    console.log(`${colors.green}✓${colors.reset} ${file} - 구문 정상`);
    testResults.passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${file} - ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`구문 오류 (${file}): ${error.message}`);
  }
});

console.log('');

/**
 * 4. 클래스/함수 정의 확인
 */
console.log(`${colors.blue}[4] 클래스/함수 정의 확인${colors.reset}`);

const classChecks = [
  { file: 'js/geometry-shapes.js', name: 'GeometryShapes', type: 'class' },
  { file: 'js/ar-marker.js', name: 'ARMarkerController', type: 'class' },
  { file: 'js/ar-markerless.js', name: 'ARMarkerlessController', type: 'class' },
  { file: 'js/shape-builder.js', name: 'ShapeBuilder', type: 'class' }
];

classChecks.forEach(check => {
  testResults.total++;
  try {
    const content = fs.readFileSync(check.file, 'utf8');
    const pattern = new RegExp(`class\\s+${check.name}`);
    
    if (pattern.test(content)) {
      console.log(`${colors.green}✓${colors.reset} ${check.name} 클래스 정의됨 (${check.file})`);
      testResults.passed++;
    } else {
      throw new Error(`${check.name} 클래스 정의 없음`);
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${check.file} - ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`클래스 정의 오류 (${check.file}): ${error.message}`);
  }
});

console.log('');

/**
 * 5. levels.json 데이터 구조 검증
 */
console.log(`${colors.blue}[5] levels.json 데이터 구조 검증${colors.reset}`);

testResults.total++;
try {
  const levelsData = JSON.parse(fs.readFileSync('data/levels.json', 'utf8'));
  
  // levels 배열 존재 확인
  if (!levelsData.levels || !Array.isArray(levelsData.levels)) {
    throw new Error('levels 배열이 없습니다');
  }
  
  // 7개 레벨 확인
  if (levelsData.levels.length !== 7) {
    throw new Error(`레벨 개수 오류: ${levelsData.levels.length}개 (예상: 7개)`);
  }
  
  // 각 레벨 필수 필드 확인
  levelsData.levels.forEach((level, index) => {
    const requiredFields = ['id', 'name', 'difficulty', 'description', 'shapes'];
    requiredFields.forEach(field => {
      if (!level[field]) {
        throw new Error(`레벨 ${index + 1}: ${field} 필드 없음`);
      }
    });
  });
  
  console.log(`${colors.green}✓${colors.reset} levels.json 데이터 구조 정상 (7개 레벨)`);
  testResults.passed++;
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} levels.json - ${error.message}`);
  testResults.failed++;
  testResults.errors.push(`데이터 구조 오류: ${error.message}`);
}

console.log('');

/**
 * 6. HTML 기본 구조 검증
 */
console.log(`${colors.blue}[6] HTML 기본 구조 검증${colors.reset}`);

const htmlFiles = [
  'index.html',
  'ar-marker.html',
  'ar-markerless.html'
];

htmlFiles.forEach(file => {
  testResults.total++;
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // 기본 태그 확인
    if (!content.includes('<!DOCTYPE html>')) {
      throw new Error('DOCTYPE 선언 없음');
    }
    if (!content.includes('<html')) {
      throw new Error('<html> 태그 없음');
    }
    if (!content.includes('<head>')) {
      throw new Error('<head> 태그 없음');
    }
    if (!content.includes('<body>')) {
      throw new Error('<body> 태그 없음');
    }
    
    console.log(`${colors.green}✓${colors.reset} ${file} - HTML 구조 정상`);
    testResults.passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${file} - ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`HTML 구조 오류 (${file}): ${error.message}`);
  }
});

console.log('');

/**
 * 7. A-Frame 및 AR.js 스크립트 로드 확인
 */
console.log(`${colors.blue}[7] A-Frame 및 AR.js 스크립트 확인${colors.reset}`);

const arFiles = ['ar-marker.html', 'ar-markerless.html'];

arFiles.forEach(file => {
  testResults.total++;
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('aframe.io') && !content.includes('aframe.min.js')) {
      throw new Error('A-Frame 스크립트 로드 없음');
    }
    if (!content.includes('AR.js') && !content.includes('aframe-ar')) {
      throw new Error('AR.js 스크립트 로드 없음');
    }
    
    console.log(`${colors.green}✓${colors.reset} ${file} - A-Frame/AR.js 로드 확인`);
    testResults.passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${file} - ${error.message}`);
    testResults.failed++;
    testResults.errors.push(`스크립트 로드 오류 (${file}): ${error.message}`);
  }
});

console.log('');

/**
 * 테스트 결과 요약
 */
console.log(`${colors.cyan}========================================${colors.reset}`);
console.log(`${colors.cyan}   테스트 결과 요약${colors.reset}`);
console.log(`${colors.cyan}========================================${colors.reset}\n`);

console.log(`총 테스트: ${testResults.total}개`);
console.log(`${colors.green}통과: ${testResults.passed}개 (${Math.round(testResults.passed / testResults.total * 100)}%)${colors.reset}`);
console.log(`${colors.red}실패: ${testResults.failed}개 (${Math.round(testResults.failed / testResults.total * 100)}%)${colors.reset}`);

if (testResults.failed > 0) {
  console.log(`\n${colors.red}발견된 오류:${colors.reset}`);
  testResults.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
}

console.log('');

// 종료 코드
if (testResults.failed === 0) {
  console.log(`${colors.green}✓ 모든 테스트 통과!${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}✗ 일부 테스트 실패${colors.reset}\n`);
  process.exit(1);
}
