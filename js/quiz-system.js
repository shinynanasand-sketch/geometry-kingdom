/**
 * Quiz System
 * 퀴즈 시스템 - 문제 로드, 답변 체크, 점수 계산
 * 
 * @author Cline AI Assistant
 * @version 1.0.0
 */

class QuizSystem {
  constructor(levelId = 1) {
    this.levelId = levelId;
    this.levelData = null;
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.hintUsed = 0;
    this.timeLeft = 0;
    this.timerInterval = null;
    this.startTime = null;
    this.isAnswered = false;
  }

  /**
   * 초기화
   */
  async init() {
    try {
      console.log('[Quiz System] Initializing...');
      
      // 레벨 데이터 로드
      await this.loadLevelData();
      
      // 문제 로드
      await this.loadQuestions();
      
      // 타이머 시작
      this.startTimer();
      
      // 첫 번째 문제 표시
      this.displayQuestion();
      
      // 시작 시간 기록
      this.startTime = Date.now();
      
      console.log('[Quiz System] Initialized successfully');
    } catch (error) {
      console.error('[Quiz System] Initialization failed:', error);
      alert('퀴즈를 불러오는데 실패했습니다.');
    }
  }

  /**
   * 레벨 데이터 로드
   */
  async loadLevelData() {
    try {
      const response = await fetch('data/levels.json');
      const data = await response.json();
      this.levelData = data.levels.find(level => level.id === this.levelId);
      
      if (!this.levelData) {
        throw new Error(`Level ${this.levelId} not found`);
      }
      
      // 타이머 설정
      this.timeLeft = this.levelData.timeLimit || 300;
      
      if (this.levelData) {
        const titleEl = document.getElementById('quiz-level-title');
        if (titleEl) {
          titleEl.textContent = `Lv.${this.levelData.id} ${this.levelData.name}`;
        }
        document.title = `퀴즈 Lv.${this.levelData.id} - 도형 왕국`;
      }

      console.log('[Quiz System] Level data loaded:', this.levelData.name);
    } catch (error) {
      console.error('[Quiz System] Failed to load level data:', error);
      throw error;
    }
  }

  /**
   * 문제 로드
   */
  async loadQuestions() {
    try {
      const response = await fetch('data/quiz-questions.json');
      const data = await response.json();
      
      // 레벨에 해당하는 문제 가져오기
      const levelKey = `level${this.levelId}`;
      this.questions = data[levelKey] || [];
      
      if (this.questions.length === 0) {
        throw new Error(`No questions found for level ${this.levelId}`);
      }
      
      // 문제 섞기 (선택사항)
      // this.shuffleQuestions();
      
      console.log('[Quiz System] Questions loaded:', this.questions.length);
    } catch (error) {
      console.error('[Quiz System] Failed to load questions:', error);
      throw error;
    }
  }

  /**
   * 문제 섞기
   */
  shuffleQuestions() {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
  }

  /**
   * 문제 표시
   */
  displayQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.showResult();
      return;
    }

    const question = this.questions[this.currentQuestionIndex];
    this.isAnswered = false;

    // 문제 텍스트
    document.getElementById('question-text').textContent = question.question;

    // 도형 표시
    if (question.shape) {
      this.displayShape(question.shape, question.shapeColor || '#4A90E2');
    }

    // 선택지 표시
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, index) => {
      const optionText = btn.querySelector('.option-text');
      optionText.textContent = question.options[index] || '';
      
      // 초기화
      btn.classList.remove('correct', 'wrong', 'disabled');
      btn.disabled = false;
    });

    // 진행률 업데이트
    this.updateProgress();

    // 피드백/해설/힌트 숨김
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('hint').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('character-dialogue').style.display = 'none';

    console.log('[Quiz System] Question displayed:', this.currentQuestionIndex + 1);
  }

  /**
   * 도형 표시
   */
  displayShape(shapeType, color) {
    const shapeDisplay = document.getElementById('shape-display');
    
    // 도형 클래스 매핑
    const shapeClasses = {
      triangle: 'triangle',
      square: 'square',
      rectangle: 'rectangle',
      circle: 'circle',
      cube: 'cube',
      sphere: 'sphere',
      cylinder: 'cylinder',
      cone: 'cone',
      pyramid: 'pyramid'
    };

    const shapeClass = shapeClasses[shapeType] || 'square';
    
    shapeDisplay.innerHTML = `
      <div class="shape ${shapeClass}" style="background-color: ${color};"></div>
    `;
  }

  /**
   * 답변 선택
   */
  selectAnswer(index) {
    if (this.isAnswered) return;

    const question = this.questions[this.currentQuestionIndex];
    const isCorrect = index === question.answer;

    this.isAnswered = true;

    // 버튼 상태 업데이트
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === question.answer) {
        btn.classList.add('correct');
      }
      if (i === index && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    // 정답/오답 처리
    if (isCorrect) {
      this.correctCount++;
      this.showFeedback(true, question);
    } else {
      this.wrongCount++;
      this.showFeedback(false, question);
    }

    // 해설 표시
    this.showExplanation(question);

    // 다음 버튼 표시
    document.getElementById('next-btn').style.display = 'inline-block';

    console.log('[Quiz System] Answer selected:', index, 'Correct:', isCorrect);
  }

  /**
   * 피드백 표시
   */
  showFeedback(isCorrect, question) {
    const feedback = document.getElementById('feedback');
    const feedbackText = feedback.querySelector('.feedback-text');

    if (isCorrect) {
      feedbackText.textContent = '정답입니다! 🎉';
      feedback.className = 'feedback correct';
      
      // 캐릭터 대사
      this.showCharacterDialogue('정답이야! 대단해!', 'sam');
    } else {
      feedbackText.textContent = '아쉬워요! 다시 도전해보세요! 💪';
      feedback.className = 'feedback wrong';
      
      // 캐릭터 대사
      this.showCharacterDialogue('괜찮아! 다음엔 맞출 수 있어!', 'dongle');
    }

    feedback.style.display = 'block';
  }

  /**
   * 해설 표시
   */
  showExplanation(question) {
    const explanation = document.getElementById('explanation');
    const explanationText = document.getElementById('explanation-text');
    
    explanationText.textContent = question.explanation || '해설이 없습니다.';
    explanation.style.display = 'block';
  }

  /**
   * 힌트 표시
   */
  showHint() {
    if (this.isAnswered) return;

    const question = this.questions[this.currentQuestionIndex];
    const hint = document.getElementById('hint');
    const hintText = document.getElementById('hint-text');
    
    hintText.textContent = question.hint || '힌트가 없습니다.';
    hint.style.display = 'block';
    
    this.hintUsed++;
    
    // 힌트 버튼 비활성화
    document.getElementById('hint-btn').disabled = true;
    
    console.log('[Quiz System] Hint shown');
  }

  /**
   * 캐릭터 대사 표시
   */
  showCharacterDialogue(text, character = 'sam') {
    const dialogue = document.getElementById('character-dialogue');
    const dialogueText = document.getElementById('dialogue-text');
    const characterImg = document.getElementById('character-img');
    
    dialogueText.textContent = text;
    characterImg.src = `assets/images/characters/${character}.png`;
    characterImg.alt = character;
    
    dialogue.style.display = 'flex';
    
    // 3초 후 숨김
    setTimeout(() => {
      dialogue.style.display = 'none';
    }, 3000);
  }

  /**
   * 다음 문제
   */
  nextQuestion() {
    this.currentQuestionIndex++;
    
    // 힌트 버튼 활성화
    document.getElementById('hint-btn').disabled = false;
    
    this.displayQuestion();
  }

  /**
   * 진행률 업데이트
   */
  updateProgress() {
    const total = this.questions.length;
    const current = this.currentQuestionIndex + 1;
    const percentage = (current / total) * 100;

    document.getElementById('progress-text').textContent = `${current} / ${total}`;
    document.getElementById('progress-bar').style.width = `${percentage}%`;
  }

  /**
   * 타이머 시작
   */
  startTimer() {
    this.updateTimerDisplay();
    
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();
      
      if (this.timeLeft <= 0) {
        this.timeUp();
      }
    }, 1000);
  }

  /**
   * 타이머 표시 업데이트
   */
  updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timer').textContent = display;
    
    // 30초 이하일 때 빨간색
    if (this.timeLeft <= 30) {
      document.getElementById('timer').style.color = '#ff6b6b';
    }
  }

  /**
   * 시간 종료
   */
  timeUp() {
    clearInterval(this.timerInterval);
    alert('시간이 종료되었습니다!');
    this.showResult();
  }

  /**
   * 점수 계산
   */
  calculateScore() {
    const total = this.questions.length;
    const baseScore = (this.correctCount / total) * 100;
    
    // 시간 보너스 (남은 시간 1초당 0.1점, 최대 10점)
    const timeBonus = Math.min(this.timeLeft * 0.1, 10);
    
    // 힌트 페널티 (힌트 1회당 -5점)
    const hintPenalty = this.hintUsed * 5;
    
    const finalScore = Math.max(0, Math.round(baseScore + timeBonus - hintPenalty));
    
    return Math.min(100, finalScore);
  }

  /**
   * 별점 계산
   */
  getStars(score) {
    return Utils.calculateStars(score);
  }

  /**
   * 결과 표시
   */
  showResult() {
    // 타이머 정지
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // 점수 계산
    const score = this.calculateScore();
    const stars = this.getStars(score);
    const percentage = Math.round((this.correctCount / this.questions.length) * 100);

    // 퀴즈 컨테이너 숨김
    document.getElementById('quiz-container').style.display = 'none';

    // 결과 컨테이너 표시
    const resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'block';

    // 별점 표시
    const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('result-stars').textContent = starDisplay;

    // 통계 표시
    document.getElementById('result-score').textContent = score;
    document.getElementById('result-correct').textContent = this.correctCount;
    document.getElementById('result-wrong').textContent = this.wrongCount;
    document.getElementById('result-percentage').textContent = `${percentage}%`;

    // 메시지
    const messages = {
      3: '완벽해요! 🎉',
      2: '잘했어요! 👏',
      1: '좋아요! 💪',
      0: '다시 도전해보세요! 🔥'
    };
    document.getElementById('result-message').textContent = messages[stars];

    // 진행도 저장 후 보상 표시
    const saveResult = this.saveProgress(score, stars);
    this.displayRewards(stars, score, saveResult);

    console.log('[Quiz System] Result shown - Score:', score, 'Stars:', stars);
  }

  /**
   * 보상 표시 및 지급
   */
  displayRewards(stars, score, saveResult = {}) {
    const requiredScore = this.levelData.requiredScore || 60;
    const passed = score >= requiredScore;
    const baseCoins = this.levelData.rewards?.coins || 50;
    const baseXP = this.levelData.rewards?.xp || 100;
    const coinBonus = stars * 50;
    const xpBonus = stars * 100;
    const totalCoins = passed ? baseCoins + coinBonus : 0;
    const totalXP = passed ? baseXP + xpBonus : 0;
    const cards = passed ? (this.levelData.rewards?.cards || []) : [];
    const cardCount = cards.length;
    const shouldGrant = passed && (saveResult.isFirstPass || saveResult.isNewRecord);

    const rewardItems = document.querySelector('.reward-items');
    if (!passed) {
      rewardItems.innerHTML = `
        <p class="reward-none">통과 점수 ${requiredScore}점 이상이 필요해요. 다시 도전해보세요!</p>
      `;
      return;
    }

    rewardItems.innerHTML = `
      <div class="reward-item">
        <span class="icon">🪙</span>
        <span class="amount">+${totalCoins}</span>
      </div>
      <div class="reward-item">
        <span class="icon">⭐</span>
        <span class="amount">+${totalXP} XP</span>
      </div>
      <div class="reward-item">
        <span class="icon">🃏</span>
        <span class="amount">카드 ${cardCount}장</span>
      </div>
    `;

    if (shouldGrant && typeof ProgressTracker !== 'undefined') {
      ProgressTracker.grantQuizRewards(this.levelId, {
        coins: totalCoins,
        xp: totalXP,
        cards,
        isNewRecord: true
      });
    }
  }

  /**
   * 진행도 저장
   */
  saveProgress(score, stars) {
    try {
      if (typeof ProgressTracker !== 'undefined') {
        const requiredScore = this.levelData.requiredScore || 60;
        const result = ProgressTracker.completeLevel(
          this.levelId,
          score,
          stars,
          requiredScore
        );

        ProgressTracker.recordQuizResult(this.correctCount, this.wrongCount);

        const playTime = Math.floor((Date.now() - this.startTime) / 1000);
        ProgressTracker.addPlayTime(playTime);
        ProgressTracker.checkAchievements();

        console.log('[Quiz System] Progress saved via ProgressTracker', result);
        return result;
      } else {
        const progressData = JSON.parse(localStorage.getItem('math-ar-progress') || '{}');

        if (!progressData.levels) {
          progressData.levels = {};
        }

        const currentLevel = progressData.levels[this.levelId] || {};
        const previousScore = currentLevel.score || 0;
        const previousStars = currentLevel.stars || 0;

        if (score > previousScore || stars > previousStars) {
          progressData.levels[this.levelId] = {
            completed: score >= (this.levelData.requiredScore || 60),
            score: Math.max(score, previousScore),
            stars: Math.max(stars, previousStars),
            time: Math.floor((Date.now() - this.startTime) / 1000),
            correctCount: this.correctCount,
            totalQuestions: this.questions.length,
            timestamp: Date.now()
          };

          progressData.coins = (progressData.coins || 0) + (this.levelData.rewards.coins || 50);
          progressData.xp = (progressData.xp || 0) + (this.levelData.rewards.xp || 100);

          localStorage.setItem('math-ar-progress', JSON.stringify(progressData));
        }

        console.log('[Quiz System] Progress saved (fallback)');
        return {
          passed: score >= (this.levelData.requiredScore || 60),
          isFirstPass: true,
          isNewRecord: score > previousScore || stars > previousStars
        };
      }
    } catch (error) {
      console.error('[Quiz System] Failed to save progress:', error);
    }
    return { passed: false, isFirstPass: false, isNewRecord: false };
  }

  /**
   * 정리
   */
  destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}

// 전역 변수로 내보내기
window.QuizSystem = QuizSystem;
