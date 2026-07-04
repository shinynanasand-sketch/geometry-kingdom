/**
 * 도형 왕국 - 진행도 추적 시스템
 * 플레이어의 진행도, 레벨, 경험치, 코인 등을 관리
 */

const ProgressTracker = {
  // 로컬 스토리지 키
  STORAGE_KEY: 'math-ar-progress',

  /**
   * 기본 진행도 데이터 구조
   */
  getDefaultProgress() {
    return {
      player: {
        level: 1,
        xp: 0,
        coins: 0,
        totalScore: 0
      },
      levels: {
        1: { completed: false, score: 0, stars: 0 },
        2: { completed: false, score: 0, stars: 0 },
        3: { completed: false, score: 0, stars: 0 },
        4: { completed: false, score: 0, stars: 0 },
        5: { completed: false, score: 0, stars: 0 },
        6: { completed: false, score: 0, stars: 0 },
        7: { completed: false, score: 0, stars: 0 }
      },
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        playTime: 0,
        lastPlayed: null
      },
      cards: [],
      badges: [],
      items: {},
      minigames: {}
    };
  },

  /**
   * 진행도 데이터 가져오기
   * @returns {Object} 진행도 데이터
   */
  getProgress() {
    const saved = Utils.getLocalStorage(this.STORAGE_KEY);
    return saved || this.getDefaultProgress();
  },

  /**
   * 진행도 데이터 저장
   * @param {Object} progress - 진행도 데이터
   */
  saveProgress(progress) {
    Utils.setLocalStorage(this.STORAGE_KEY, progress);
  },

  /**
   * 진행도 초기화
   */
  reset() {
    if (confirm('정말로 진행도를 초기화하시겠습니까?\n모든 데이터가 삭제됩니다!')) {
      Utils.removeLocalStorage(this.STORAGE_KEY);
      location.reload();
    }
  },

  /**
   * 경험치 추가
   * @param {number} amount - 추가할 경험치
   */
  addXP(amount) {
    const progress = this.getProgress();
    progress.player.xp += amount;
    
    // 레벨업 확인
    const requiredXP = Utils.getRequiredXP(progress.player.level);
    if (progress.player.xp >= requiredXP) {
      progress.player.xp -= requiredXP;
      progress.player.level++;
      Utils.showNotification(`레벨 업! 현재 레벨: ${progress.player.level}`, 'success');
    }
    
    this.saveProgress(progress);
    this.updateUI();
  },

  /**
   * 코인 추가
   * @param {number} amount - 추가할 코인
   */
  addCoins(amount) {
    const progress = this.getProgress();
    progress.player.coins += amount;
    this.saveProgress(progress);
    this.updateUI();
    Utils.showNotification(`+${amount} 코인 획득!`, 'success');
  },

  /**
   * 코인 사용
   * @param {number} amount - 사용할 코인
   * @returns {boolean} 성공 여부
   */
  useCoins(amount) {
    const progress = this.getProgress();
    if (progress.player.coins >= amount) {
      progress.player.coins -= amount;
      this.saveProgress(progress);
      this.updateUI();
      return true;
    }
    Utils.showNotification('코인이 부족합니다!', 'error');
    return false;
  },

  /**
   * 레벨 완료 처리
   * @param {number} levelId - 레벨 ID
   * @param {number} score - 점수
   * @param {number} [stars] - 별점 (미지정 시 점수로 계산)
   * @param {number} [requiredScore=0] - 통과 기준 점수
   */
  completeLevel(levelId, score, stars, requiredScore = 0) {
    const progress = this.getProgress();
    const finalStars = stars !== undefined ? stars : Utils.calculateStars(score);
    const levelState = progress.levels[levelId];
    const prevScore = levelState.score;
    const prevStars = levelState.stars;
    const wasCompleted = levelState.completed;

    if (score > levelState.score) {
      progress.player.totalScore += score - levelState.score;
      levelState.score = score;
    }

    if (finalStars > levelState.stars) {
      levelState.stars = finalStars;
    }

    const passed = score >= requiredScore;
    if (passed) {
      levelState.completed = true;
    }

    this.saveProgress(progress);
    this.updateUI();

    return {
      passed,
      stars: finalStars,
      isNewRecord: score > prevScore || finalStars > prevStars,
      isFirstPass: passed && !wasCompleted
    };
  },

  /**
   * 퀴즈 보상 지급 (통과 시, 최초 통과 또는 기록 갱신 시)
   */
  grantQuizRewards(levelId, { coins, xp, cards, isNewRecord }) {
    if (!isNewRecord) return;

    if (coins > 0) {
      const progress = this.getProgress();
      progress.player.coins += coins;
      this.saveProgress(progress);
      this.updateUI();
      Utils.showNotification(`+${coins} 코인 획득!`, 'success');
    }

    if (xp > 0) {
      this.addXP(xp);
    }

    (cards || []).forEach((cardId) => {
      const id = cardId.replace(/-card$/, '');
      this.addCard(id);
    });
  },

  /**
   * 퀴즈 결과 기록
   * @param {number} correct - 정답 수
   * @param {number} wrong - 오답 수
   */
  recordQuizResult(correct, wrong) {
    const progress = this.getProgress();
    progress.stats.totalQuestions += (correct + wrong);
    progress.stats.correctAnswers += correct;
    progress.stats.wrongAnswers += wrong;
    progress.stats.lastPlayed = new Date().toISOString();
    this.saveProgress(progress);
  },

  /**
   * 플레이 시간 추가
   * @param {number} seconds - 초
   */
  addPlayTime(seconds) {
    const progress = this.getProgress();
    progress.stats.playTime += seconds;
    this.saveProgress(progress);
  },

  /**
   * 카드 추가
   * @param {string} cardId - 카드 ID
   */
  addCard(cardId) {
    const progress = this.getProgress();
    if (!progress.cards.includes(cardId)) {
      progress.cards.push(cardId);
      this.saveProgress(progress);
      Utils.showNotification(`새로운 카드 획득: ${cardId}`, 'success');
    }
  },

  /**
   * 배지 추가
   * @param {string} badgeId - 배지 ID
   */
  addBadge(badgeId) {
    const progress = this.getProgress();
    if (!progress.badges.includes(badgeId)) {
      progress.badges.push(badgeId);
      this.saveProgress(progress);
      Utils.showNotification(`새로운 배지 획득: ${badgeId}`, 'success');
    }
  },

  /**
   * 아이템 추가
   * @param {string} itemId - 아이템 ID
   * @param {number} count - 개수
   */
  addItem(itemId, count = 1) {
    const progress = this.getProgress();
    if (!progress.items[itemId]) {
      progress.items[itemId] = 0;
    }
    progress.items[itemId] += count;
    this.saveProgress(progress);
  },

  /**
   * 아이템 사용
   * @param {string} itemId - 아이템 ID
   * @param {number} count - 개수
   * @returns {boolean} 성공 여부
   */
  useItem(itemId, count = 1) {
    const progress = this.getProgress();
    if (progress.items[itemId] && progress.items[itemId] >= count) {
      progress.items[itemId] -= count;
      this.saveProgress(progress);
      return true;
    }
    return false;
  },

  /**
   * 미니게임 플레이 횟수 증가
   * @param {string} gameId - 게임 ID
   */
  incrementMinigamePlays(gameId) {
    const progress = this.getProgress();
    if (!progress.minigames[gameId]) {
      progress.minigames[gameId] = { plays: 0, highscore: 0 };
    }
    progress.minigames[gameId].plays++;
    this.saveProgress(progress);
  },

  /**
   * 미니게임 최고 점수 업데이트
   * @param {string} gameId - 게임 ID
   * @param {number} score - 점수
   */
  updateMinigameHighscore(gameId, score) {
    const progress = this.getProgress();
    if (!progress.minigames[gameId]) {
      progress.minigames[gameId] = { plays: 0, highscore: 0 };
    }
    if (score > progress.minigames[gameId].highscore) {
      progress.minigames[gameId].highscore = score;
      this.saveProgress(progress);
      Utils.showNotification('새로운 최고 점수!', 'success');
    }
  },

  /**
   * UI 업데이트
   */
  updateUI() {
    const progress = this.getProgress();
    
    // 플레이어 레벨
    const levelEl = document.getElementById('player-level');
    if (levelEl) {
      levelEl.textContent = `Lv.${progress.player.level}`;
    }
    
    // 코인
    const coinEl = document.getElementById('coin-count');
    if (coinEl) {
      coinEl.textContent = Utils.formatNumber(progress.player.coins);
    }
    
    // 경험치
    const xpEl = document.getElementById('xp-count');
    if (xpEl) {
      xpEl.textContent = Utils.formatNumber(progress.player.xp);
    }
    
    // 경험치 바
    const xpBarEl = document.getElementById('xp-bar');
    if (xpBarEl) {
      const requiredXP = Utils.getRequiredXP(progress.player.level);
      const percentage = (progress.player.xp / requiredXP) * 100;
      xpBarEl.style.width = `${percentage}%`;
    }
  },

  /**
   * 업적 확인
   */
  checkAchievements() {
    const progress = this.getProgress();
    
    // 첫 걸음 (첫 레벨 완료)
    if (progress.levels[1].completed && !progress.badges.includes('first-step')) {
      this.addBadge('first-step');
    }
    
    // 탐험가 (모든 레벨 방문)
    const visitedLevels = Object.values(progress.levels).filter(l => l.score > 0).length;
    if (visitedLevels === 7 && !progress.badges.includes('explorer')) {
      this.addBadge('explorer');
    }
    
    // 완벽주의자 (모든 레벨 3개 별)
    const perfectLevels = Object.values(progress.levels).filter(l => l.stars === 3).length;
    if (perfectLevels === 7 && !progress.badges.includes('perfectionist')) {
      this.addBadge('perfectionist');
    }
    
    // 수학 천재 (100문제 정답)
    if (progress.stats.correctAnswers >= 100 && !progress.badges.includes('genius')) {
      this.addBadge('genius');
    }
    
    // 수집가 (카드 30장)
    if (progress.cards.length >= 30 && !progress.badges.includes('collector')) {
      this.addBadge('collector');
    }
    
    // 마스터 수집가 (모든 카드)
    if (progress.cards.length >= 50 && !progress.badges.includes('master-collector')) {
      this.addBadge('master-collector');
    }
    
    // 부자 (코인 1000개)
    if (progress.player.coins >= 1000 && !progress.badges.includes('rich')) {
      this.addBadge('rich');
    }
  }
};

// 페이지 로드 시 UI 업데이트
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    ProgressTracker.updateUI();
  });
}

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProgressTracker;
}
