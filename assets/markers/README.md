# AR 마커 가이드

## 📋 마커 사용 방법

이 폴더에는 AR 학습에 사용되는 마커 이미지들이 저장됩니다.

### 기본 마커 (AR.js 내장)

1. **Hiro 마커**
   - AR.js에 기본 내장된 마커
   - 다운로드: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png
   - 사용: `<a-marker preset="hiro">`

2. **Kanji 마커**
   - AR.js에 기본 내장된 마커
   - 다운로드: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/kanji.png
   - 사용: `<a-marker preset="kanji">`

### 마커 다운로드 방법

#### 방법 1: 직접 다운로드

1. 위 링크를 클릭하여 마커 이미지 다운로드
2. `assets/markers/` 폴더에 저장
3. 파일명: `hiro.png`, `kanji.png`

#### 방법 2: 명령어로 다운로드 (Windows)

```powershell
# PowerShell에서 실행
cd assets/markers

# Hiro 마커 다운로드
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png" -OutFile "hiro.png"

# Kanji 마커 다운로드
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/kanji.png" -OutFile "kanji.png"
```

### 마커 인쇄 방법

1. **권장 크기**: A4 용지에 10cm x 10cm 이상
2. **인쇄 설정**:
   - 고품질 인쇄
   - 흑백 또는 컬러 (흑백 권장)
   - 광택 없는 용지 사용
3. **사용 팁**:
   - 평평한 곳에 놓기
   - 밝은 조명 아래에서 사용
   - 마커가 구겨지지 않도록 주의

### 커스텀 마커 생성 (선택사항)

레벨별 커스텀 마커를 만들고 싶다면:

1. **AR.js Marker Training** 사용
   - 웹사이트: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
   
2. **마커 이미지 업로드**
   - 간단한 흑백 이미지 사용 (512x512px 권장)
   - 복잡하지 않은 디자인
   
3. **패턴 파일 다운로드**
   - `.patt` 파일 생성
   - `assets/markers/` 폴더에 저장
   - 파일명: `level1-marker.patt`, `level2-marker.patt` 등

4. **HTML에서 사용**
   ```html
   <a-marker type="pattern" url="assets/markers/level1-marker.patt">
   ```

### 현재 프로젝트에서 사용 중인 마커

- ✅ **Hiro** (marker-hiro): 레벨 1-7에서 사용
- ✅ **Kanji** (marker-kanji): 레벨 1-7에서 사용
- ⏳ **커스텀 마커**: 추후 추가 예정

### 테스트 방법

1. 마커를 인쇄하거나 화면에 표시
2. `ar-marker.html?level=1` 페이지 열기
3. 카메라 권한 허용
4. 마커를 카메라에 비추기
5. 도형이 나타나는지 확인

### 문제 해결

**마커가 인식되지 않을 때:**
- 조명이 충분한지 확인
- 마커가 평평한지 확인
- 카메라와 마커 사이 거리 조절 (20-50cm 권장)
- 마커가 화면에 완전히 보이는지 확인
- 브라우저 콘솔에서 에러 확인

**인식이 불안정할 때:**
- 마커를 더 크게 인쇄
- 더 밝은 곳으로 이동
- 카메라 렌즈 청소
- 마커 주변에 다른 패턴이 없는지 확인

---

## 📦 필요한 파일 목록

### 필수 (기본 테스트용)
- [ ] `hiro.png` - Hiro 마커 이미지
- [ ] `kanji.png` - Kanji 마커 이미지

### 선택 (커스텀 마커)
- [ ] `level1-marker.patt` - 레벨 1 커스텀 마커
- [ ] `level2-marker.patt` - 레벨 2 커스텀 마커
- [ ] `level3-marker.patt` - 레벨 3 커스텀 마커
- [ ] `level4-marker.patt` - 레벨 4 커스텀 마커
- [ ] `level5-marker.patt` - 레벨 5 커스텀 마커
- [ ] `level6-marker.patt` - 레벨 6 커스텀 마커
- [ ] `juryeonggu-marker.patt` - 주령구 레벨 마커

---

**작성일**: 2026년 5월 18일  
**버전**: 1.0
