/**
 * 도형 왕국 - 메인 애플리케이션
 * 앱 초기화 및 전역 이벤트 처리
 */

const App = {
  /**
   * 앱 초기화
   */
  init() {
    console.log('🔷 도형 왕국 시작!');
    
    // 진행도 UI 업데이트
    ProgressTracker.updateUI();
    
    // 이벤트 리스너 등록
    this.setupEventListeners();
    
    // 레벨 카드 초기화
    this.initializeLevelCards();
    
    // 업적 확인
    ProgressTracker.checkAchievements();
    
    // 환영 메시지
    this.showWelcomeMessage();
  },

  /**
   * 이벤트 리스너 설정
   */
  setupEventListeners() {
    // 레벨 카드 클릭 이벤트
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // 버튼 클릭은 제외
        if (!e.target.closest('.btn')) {
          const levelId = card.dataset.level;
          this.showLevelInfo(levelId);
        }
      });
    });

    // 특별 콘텐츠 카드 애니메이션
    document.querySelectorAll('.special-card, .game-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        Utils.animateElement(card, 'bounce');
      });
    });

    // 네비게이션 활성화 표시
    this.highlightCurrentPage();
  },

  /**
   * 레벨 카드 초기화
   */
  initializeLevelCards() {
    const progress = ProgressTracker.getProgress();
    
    // 각 레벨 카드에 진행도 표시
    for (let i = 1; i <= 7; i++) {
      const levelData = progress.levels[i];
      const scoreEl = document.getElementById(`level${i}-score`);
      
      if (scoreEl && levelData) {
        scoreEl.textContent = levelData.score;
        
        // 별점 표시
        const card = document.querySelector(`.level-card[data-level="${i}"]`);
        if (card) {
          const starEls = card.querySelectorAll('.stars .star');
          starEls.forEach((starEl, index) => {
            if (index < levelData.stars) {
              starEl.classList.remove('empty');
              starEl.classList.add('filled');
              starEl.textContent = '⭐';
            } else {
              starEl.classList.add('empty');
              starEl.classList.remove('filled');
              starEl.textContent = '☆';
            }
          });
        }
      }
    }
  },

  /**
   * 레벨 정보 표시
   * @param {number} levelId - 레벨 ID
   */
  showLevelInfo(levelId) {
    const progress = ProgressTracker.getProgress();
    const levelData = progress.levels[levelId];
    
    const levelNames = {
      1: '평면 도형 기초',
      2: '평면 도형 심화',
      3: '입체 도형 기초',
      4: '입체 도형 심화',
      5: '넓이와 부피',
      6: '종합 문제',
      7: '주령구 (14면체)'
    };
    
    const message = `
      레벨 ${levelId}: ${levelNames[levelId]}
      
      최고 점수: ${levelData.score}
      별점: ${'⭐'.repeat(levelData.stars)}${'☆'.repeat(3 - levelData.stars)}
      ${levelData.completed ? '✅ 완료' : '⏳ 미완료'}
    `;
    
    alert(message);
  },

  /**
   * 현재 페이지 하이라이트
   */
  highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === currentPage) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  },

  /**
   * 환영 메시지 표시
   */
  showWelcomeMessage() {
    const progress = ProgressTracker.getProgress();
    const isFirstVisit = !Utils.getLocalStorage('visited_before');
    
    if (isFirstVisit) {
      Utils.setLocalStorage('visited_before', true);
      setTimeout(() => {
        Utils.showNotification('도형 왕국에 오신 것을 환영합니다! 🎉', 'success');
      }, 500);
    } else {
      // 레벨업 확인
      const lastLevel = Utils.getLocalStorage('last_level', 1);
      if (progress.player.level > lastLevel) {
        Utils.showNotification(`레벨 ${progress.player.level}이 되었습니다! 🎊`, 'success');
        Utils.setLocalStorage('last_level', progress.player.level);
      }
    }
  },

  /**
   * 테스트 데이터 추가 (개발용)
   */
  addTestData() {
    console.log('테스트 데이터 추가 중...');
    
    // 코인 추가
    ProgressTracker.addCoins(500);
    
    // 경험치 추가
    ProgressTracker.addXP(150);
    
    // 레벨 완료
    ProgressTracker.completeLevel(1, 95);
    
    // 카드 추가
    ProgressTracker.addCard('triangle');
    ProgressTracker.addCard('square');
    ProgressTracker.addCard('circle');
    
    // 아이템 추가
    ProgressTracker.addItem('hint-card', 3);
    ProgressTracker.addItem('time-extend', 2);
    
    Utils.showNotification('테스트 데이터가 추가되었습니다!', 'success');
    
    // UI 업데이트
    ProgressTracker.updateUI();
    this.initializeLevelCards();
  },

  /**
   * 디버그 정보 표시
   */
  showDebugInfo() {
    const progress = ProgressTracker.getProgress();
    console.log('=== 디버그 정보 ===');
    console.log('플레이어:', progress.player);
    console.log('레벨:', progress.levels);
    console.log('통계:', progress.stats);
    console.log('카드:', progress.cards);
    console.log('배지:', progress.badges);
    console.log('아이템:', progress.items);
    console.log('미니게임:', progress.minigames);
  }
};

// 페이지 로드 시 앱 초기화
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    App.init();
  });
  
  // 개발용 전역 함수
  window.App = App;
  window.ProgressTracker = ProgressTracker;
  window.Utils = Utils;
  
  // 콘솔에서 사용 가능한 명령어 안내
  console.log(`
    🔷 도형 왕국 개발자 도구
    
    사용 가능한 명령어:
    - App.addTestData() : 테스트 데이터 추가
    - App.showDebugInfo() : 디버그 정보 표시
    - ProgressTracker.reset() : 진행도 초기화
    - ProgressTracker.addCoins(100) : 코인 추가
    - ProgressTracker.addXP(50) : 경험치 추가
  `);
}

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = App;
}
