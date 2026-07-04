/**
 * Specification Driven Development (SSD) 리포트 생성기
 * PRD / SRS / 코드베이스 / AI 협업 로그를 읽어 GitHub 기본 README.md 를 갱신합니다.
 * (docs/SSD_REPORT.md 는 README로 안내하는 짧은 포인터만 유지)
 *
 * 사용: node scripts/generate-ssd-report.js
 * 이후 구현 시 PRD·ssd-ai-log.json·코드를 수정한 뒤 이 스크립트를 실행하면 반영됩니다.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_README = path.join(ROOT, 'README.md');
const OUT_POINTER = path.join(ROOT, 'docs', 'SSD_REPORT.md');

function read(rel) {
  const p = path.join(ROOT, rel);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function readJson(rel, fallback) {
  try {
    return JSON.parse(read(rel));
  } catch {
    return fallback;
  }
}

function extractPhaseTable(prd) {
  const m = prd.match(/\| 순위 \| Phase \|[\s\S]*?\n\n/);
  return m ? m[0].trim() : '(PRD에서 Phase 표를 찾지 못했습니다)';
}

function extractSection(md, headingPattern, maxLen = 1200) {
  const re = new RegExp(`(#{2,3}[^\n]*${headingPattern}[^\n]*\n)([\\s\\S]*?)(?=\n#{2,3} |$)`);
  const m = md.match(re);
  if (!m) return '';
  let body = (m[1] + m[2]).trim();
  if (body.length > maxLen) body = body.slice(0, maxLen) + '\n\n…(상세는 원문 문서 참조)';
  return body;
}

function listFiles(dir, extList, acc = []) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return acc;
  for (const name of fs.readdirSync(full)) {
    const rel = path.join(dir, name).replace(/\\/g, '/');
    const st = fs.statSync(path.join(ROOT, rel));
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git') continue;
      listFiles(rel, extList, acc);
    } else if (extList.some((e) => name.endsWith(e))) {
      acc.push(rel);
    }
  }
  return acc;
}

function fileExists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function buildTechInventory() {
  const rows = [
    ['HTML5 / CSS3 / Vanilla JS', '앱 전체 UI·로직', fileExists('index.html')],
    ['A-Frame 1.4', 'WebGL 3D 씬', true],
    ['AR.js (조건부)', '마커 AR — `mode=camera` 일 때만 로드', fileExists('ar-marker.html')],
    ['LocalStorage', '진행도·퀴즈 보상 (`progress-tracker.js`)', fileExists('js/progress-tracker.js')],
    ['levels.json', '레벨·도형·보상 명세', fileExists('data/levels.json')],
    ['quiz-questions.json + quiz-data.js', '레벨별 퀴즈 (캐시 우회)', fileExists('js/quiz-data.js')],
    ['GitHub Pages', '학생 테스트용 정적 호스팅', fileExists('.github/workflows/pages.yml')],
    ['Node serve.js', '로컬 개발 서버 (캐시 비활성)', fileExists('serve.js')]
  ];
  return rows
    .map(([name, role, ok]) => `| ${name} | ${role} | ${ok ? '✅' : '⏳'} |`)
    .join('\n');
}

function buildModuleTable() {
  const modules = [
    ['js/app.js', '홈·레벨 카드 UI'],
    ['js/ar-marker.js', '레벨 1–2 컨트롤러 (3D 기본 / 카메라 테스트)'],
    ['js/ar-markerless.js', '레벨 3–4 관련 모듈 (페이지는 인라인 3D 중심)'],
    ['js/ar-3d-helper.js', '3D 씬·배치·카메라 폴백 공통'],
    ['js/ar-shape-controls.js', '선택·드래그 회전·크기 ±'],
    ['js/geometry-shapes.js', '도형 메시 생성·메타데이터'],
    ['js/quiz-system.js', '퀴즈 엔진'],
    ['js/quiz-data.js', '레벨별 퀴즈 데이터(내장)'],
    ['js/progress-tracker.js', '진행도 LocalStorage'],
    ['js/shape-builder.js', '도형 창작(Phase 7, 부분)'],
    ['markers-test.html', '화면용 AR 마커 (인쇄 없이 테스트)']
  ];
  return modules
    .map(([f, d]) => `| \`${f}\` | ${d} | ${fileExists(f) ? '✅' : '❌'} |`)
    .join('\n');
}

function buildLevelsTable(levelsJson) {
  const levels = levelsJson.levels || [];
  return levels
    .map((l) => {
      const shapes = (l.shapes || []).map((s) => s.name || s.type).join(', ');
      const ar =
        l.id <= 2 ? 'ar-marker.html (3D 기본)' :
        l.id <= 4 ? 'ar-markerless.html (3D)' :
        '데이터·퀴즈 위주 (AR 보강 예정)';
      return `| ${l.id} | ${l.name} | ${l.description || ''} | ${shapes} | ${ar} |`;
    })
    .join('\n');
}

function buildAiLog(log) {
  const entries = log.entries || [];
  if (!entries.length) return '_아직 기록이 없습니다. `docs/ssd-ai-log.json`에 항목을 추가하세요._';
  return entries
    .slice()
    .reverse()
    .map(
      (e) =>
        `| ${e.date} | ${e.actor} | ${e.type} | ${e.summary} |`
    )
    .join('\n');
}

function buildSrsFrSummary(srs) {
  const frBlocks = srs.match(/#### FR-[A-Z]+-\d+:[^\n]+/g) || [];
  if (!frBlocks.length) {
    return extractSection(srs, '기능 요구사항', 800) || '(SRS 기능 요구사항 요약 없음)';
  }
  const implementedHints = {
    'AR': '✅ 부분(3D 기본 + 카메라 테스트)',
    '레벨': '✅ 레벨 1–4 학습, 5–7 데이터/퀴즈',
    '퀴즈': '✅ 레벨별 문제',
    '진행': '✅ LocalStorage',
    '게임': '⏳ 스텁',
    '주령': '⏳ 페이지/데이터',
    '창작': '⏳ 부분'
  };
  return frBlocks
    .map((line) => {
      const title = line.replace(/^####\s*/, '');
      let status = '⏳';
      for (const [k, v] of Object.entries(implementedHints)) {
        if (title.includes(k)) status = v;
      }
      return `- ${title} — ${status}`;
    })
    .join('\n');
}

function main() {
  const prd = read('docs/PRD.md');
  const srs = read('docs/SRS.md');
  const levels = readJson('data/levels.json', { levels: [] });
  const aiLog = readJson('docs/ssd-ai-log.json', { entries: [] });
  const now = new Date().toISOString().slice(0, 10);

  const htmlCount = listFiles('.', ['.html']).filter((f) => !f.includes('node_modules')).length;
  const jsCount = listFiles('js', ['.js']).length;

  const md = `# 도형 왕국 (Geometry Kingdom)

> **초등학생용 기하학 AR 학습 웹앱** — Specification Driven Development (SSD) 안내  
> 자동 생성: \`${now}\` · 생성기: \`scripts/generate-ssd-report.js\`

GitHub 저장소 **기본 README**입니다. PRD·SRS·구현 기술·AI 협업을 SSD 관점에서 정리합니다.

| 바로가기 | 링크 |
|----------|------|
| **학생 테스트 (온라인)** | https://shinynanasand-sketch.github.io/geometry-kingdom/ |
| 제품 요구사항 (PRD) | [docs/PRD.md](docs/PRD.md) |
| 소프트웨어 요구사항 (SRS) | [docs/SRS.md](docs/SRS.md) |
| 학생 테스트 안내 | [docs/STUDENT_TEST.md](docs/STUDENT_TEST.md) |
| AI 협업 로그 | [docs/ssd-ai-log.json](docs/ssd-ai-log.json) |

---

## 시작하기

1. **학생·테스터:** 위 **학생 테스트** 링크를 Chrome으로 엽니다. (설치 불필요)
2. **개발자:** 저장소를 클론한 뒤 \`node serve.js\` → http://localhost:8000
3. **문서 갱신:** 명세/코드 수정 후 \`node scripts/generate-ssd-report.js\` (master push 시 Actions가 자동 실행)

---

## 1. SSD란 이 프로젝트에서 어떻게 적용했는가

1. **명세 선행**: PRD(제품)·SRS(소프트웨어 요구)·TRD/구현계획으로 범위와 우선순위를 고정
2. **명세 → 구현 추적**: Phase 표(PRD)와 레벨/퀴즈 데이터(\`levels.json\`, \`quiz-*\`)가 구현의 단일 기준
3. **AI 협업**: Cursor Agent가 명세를 읽고 구현·버그 수정·문서 갱신을 수행, 결정은 사람이 승인
4. **검증 루프**: 로컬(\`serve.js\`) + GitHub Pages로 초등 테스터가 링크로 검증
5. **문서 자동 갱신**: PRD / \`ssd-ai-log.json\` / 코드 변경 시 본 리포트를 재생성

\`\`\`
PRD / SRS  ──►  구현 (HTML/JS/Data)  ──►  Pages 배포  ──►  학생 테스트
   ▲                    │
   └──── AI 협업 로그 · SSD 리포트 자동 생성 ◄───┘
\`\`\`

---

## 2. 제품 요구사항 (PRD 요약)

### 2.1 제품 한 줄

초등학생이 **웹 브라우저**에서 **3D/AR 도형**을 조작하며 기하를 배우고, **레벨별 퀴즈**로 확인하는 교육 웹앱.

### 2.2 가치 제안 (PRD)

- 시각화 학습 (3D 도형)
- 게임화·자기주도 학습
- 주령구 등 문화 융합 (후속 Phase)
- 설치 없는 웹 접근성

### 2.3 Phase 상태 (PRD에서 추출)

${extractPhaseTable(prd)}

### 2.4 출시 계획 요약

| 버전 | 상태 | 내용 |
|------|------|------|
| v0.5 MVP | ✅ 달성 (2026-07-04) | 레벨 1–4 3D, 레벨별 퀴즈, 카메라 OFF 기본 |
| v0.8 Beta | 🔄 다음 | 레벨 5–7 AR, 주령구, 게이미피케이션, 미니게임 |
| v1.0 | ⏳ 계획 | 전 기능·최적화·가이드 |

---

## 3. 소프트웨어 요구사항 (SRS 요약)

### 3.1 범위

| 포함 | 제외 (SRS) |
|------|------------|
| AR/3D 도형 시각화 | 서버 인증 |
| 7개 레벨 학습 구조 | 실시간 멀티플레이 |
| 퀴즈·평가 | 유료 결제 |
| LocalStorage 진행도 | 소셜 로그인 |

### 3.2 아키텍처 (SRS)

- **클라이언트 전용** SPA성 멀티 페이지 (HTML + Vanilla JS)
- **A-Frame** 3D, **AR.js**는 카메라 테스트 모드에서만
- **LocalStorage**로 진행도 유지
- CDN: A-Frame, (조건부) AR.js, Google Fonts

### 3.3 기능 요구사항 추적 (FR 헤더 기준)

${buildSrsFrSummary(srs)}

### 3.4 비기능 요구사항 (요지)

- 성능: 로컬/정적 호스팅, 평균 로딩 목표 < 3초 (추가 측정 필요)
- 사용성: 초등 대상, 카메라 없이도 학습 가능
- 호환: 최신 Chrome/Safari/Edge, 모바일 브라우저
- 유지보수: 명세·데이터 파일로 콘텐츠 분리

---

## 4. 현재까지 구현한 기술

### 4.1 기술 스택

| 기술 | 역할 | 상태 |
|------|------|------|
${buildTechInventory()}

### 4.2 주요 모듈

| 파일 | 역할 | 존재 |
|------|------|------|
${buildModuleTable()}

### 4.3 레벨·콘텐츠 매핑 (\`data/levels.json\`)

| ID | 이름 | 설명 | 도형 | 학습 UI |
|----|------|------|------|---------|
${buildLevelsTable(levels)}

### 4.4 사용자 조작 (MVP)

| 기능 | 설명 |
|------|------|
| 도형 놓기 | 📍 버튼 / 바닥 클릭 |
| 선택 | 도형 클릭 (살짝 확대) |
| 크기 | − / + |
| 회전 | 🔄 ON 후 마우스·터치 드래그 |
| 정보 | ℹ️ (자동 표시 없음) |
| 삭제 | 🗑️ |
| 카메라 테스트 | 카메라 ON → 시뮬레이션 / 화면 마커 |

### 4.5 코드베이스 규모 (자동 집계)

- HTML 파일: **${htmlCount}**
- \`js/\` 스크립트: **${jsCount}**

---

## 5. AI와 협업 내용

### 5.1 협업 방식

| 역할 | 담당 |
|------|------|
| 명세 작성·우선순위 | 사람 + AI (PRD/SRS) |
| 구현·리팩터·버그 수정 | Cursor Agent |
| 수락·배포·학생 테스트 운영 | 사람 |
| 문서 동기화 | \`generate-ssd-report.js\` + CI |

### 5.2 협업 타임라인 (\`docs/ssd-ai-log.json\`)

| 날짜 | 주체 | 유형 | 요약 |
|------|------|------|------|
${buildAiLog(aiLog)}

### 5.3 로그 추가 방법 (이후 구현 시)

\`docs/ssd-ai-log.json\`의 \`entries\` 배열에 객체를 추가합니다.

\`\`\`json
{
  "date": "YYYY-MM-DD",
  "actor": "Cursor Agent / Human",
  "type": "feature|fix|docs|mvp|ux|content|infra",
  "summary": "한 줄 요약"
}
\`\`\`

그다음:

\`\`\`bash
node scripts/generate-ssd-report.js
\`\`\`

\`master\`에 push하면 GitHub Actions가 리포트를 재생성·커밋하고 Pages에 반영합니다.

---

## 6. 명세 ↔ 구현 갭 (다음 SSD 작업)

| 항목 | 명세 | 구현 | 다음 액션 |
|------|------|------|-----------|
| 레벨 5–7 AR | PRD/SRS | 퀴즈·데이터 위주 | AR 체험 UI 보강 |
| 주령구 | Phase 5 | 페이지 스텁 | Phase 5 구현 |
| 게이미피케이션 | Phase 6 | 진행도 일부 | 상점·도감·미니게임 |
| 도형 창작 | Phase 7 | shape-builder 부분 | 연동·검증 UX |
| 모바일 최적화 | 비기능 | 부분 | 실기기 QA |
| 베타 테스트 | 단기 목표 | Pages 배포 완료 | 초등 테스터 피드백 |

---

## 7. 참고 링크

| 문서/리소스 | URL |
|-------------|-----|
| 저장소 | https://github.com/shinynanasand-sketch/geometry-kingdom |
| 학생 테스트 | https://shinynanasand-sketch.github.io/geometry-kingdom/ |
| README (본 문서) | https://github.com/shinynanasand-sketch/geometry-kingdom#readme |
| README (Pages) | https://shinynanasand-sketch.github.io/geometry-kingdom/README.md |
| PRD | [docs/PRD.md](docs/PRD.md) |
| SRS | [docs/SRS.md](docs/SRS.md) |
| 학생 안내 | [docs/STUDENT_TEST.md](docs/STUDENT_TEST.md) |

---

*이 README는 수동으로 길게 편집하지 마세요. \`scripts/generate-ssd-report.js\`로 생성됩니다.  
AI 협업 기록은 \`docs/ssd-ai-log.json\`에 추가하세요.*
`;

  fs.writeFileSync(OUT_README, md, 'utf8');

  const pointer = `# SSD 리포트

본 내용은 저장소 루트 **[README.md](../README.md)** 로 통합되었습니다.

- GitHub: https://github.com/shinynanasand-sketch/geometry-kingdom#readme
- Pages: https://shinynanasand-sketch.github.io/geometry-kingdom/README.md

갱신: \`node scripts/generate-ssd-report.js\`
`;
  fs.mkdirSync(path.dirname(OUT_POINTER), { recursive: true });
  fs.writeFileSync(OUT_POINTER, pointer, 'utf8');

  console.log('Wrote', path.relative(ROOT, OUT_README));
  console.log('Wrote', path.relative(ROOT, OUT_POINTER));
}

main();
