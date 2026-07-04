/**
 * 도형 왕국 - 유틸리티 함수
 * 공통으로 사용되는 헬퍼 함수들
 */

const Utils = {
  /**
   * 로컬 스토리지에서 데이터 가져오기
   * @param {string} key - 키
   * @param {*} defaultValue - 기본값
   * @returns {*} 저장된 값 또는 기본값
   */
  getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('로컬 스토리지 읽기 오류:', error);
      return defaultValue;
    }
  },

  /**
   * 로컬 스토리지에 데이터 저장
   * @param {string} key - 키
   * @param {*} value - 값
   * @returns {boolean} 성공 여부
   */
  setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('로컬 스토리지 저장 오류:', error);
      return false;
    }
  },

  /**
   * 로컬 스토리지에서 데이터 삭제
   * @param {string} key - 키
   */
  removeLocalStorage(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('로컬 스토리지 삭제 오류:', error);
    }
  },

  /**
   * URL 파라미터 가져오기
   * @param {string} param - 파라미터 이름
   * @returns {string|null} 파라미터 값
   */
  getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },

  /**
   * 숫자를 천 단위로 포맷
   * @param {number} num - 숫자
   * @returns {string} 포맷된 문자열
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  /**
   * 날짜를 포맷
   * @param {Date} date - 날짜 객체
   * @returns {string} 포맷된 날짜 문자열
   */
  formatDate(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 시간을 포맷 (분:초)
   * @param {number} seconds - 초
   * @returns {string} 포맷된 시간 문자열
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  },

  /**
   * 랜덤 정수 생성
   * @param {number} min - 최소값
   * @param {number} max - 최대값
   * @returns {number} 랜덤 정수
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * 배열 섞기 (Fisher-Yates)
   * @param {Array} array - 배열
   * @returns {Array} 섞인 배열
   */
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * 배열에서 랜덤 요소 선택
   * @param {Array} array - 배열
   * @returns {*} 랜덤 요소
   */
  randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  /**
   * 디바운스 함수
   * @param {Function} func - 실행할 함수
   * @param {number} wait - 대기 시간 (ms)
   * @returns {Function} 디바운스된 함수
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 쓰로틀 함수
   * @param {Function} func - 실행할 함수
   * @param {number} limit - 제한 시간 (ms)
   * @returns {Function} 쓰로틀된 함수
   */
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 요소가 뷰포트에 보이는지 확인
   * @param {HTMLElement} element - 확인할 요소
   * @returns {boolean} 보이는지 여부
   */
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * 요소를 부드럽게 스크롤
   * @param {HTMLElement} element - 스크롤할 요소
   */
  smoothScrollTo(element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  },

  /**
   * 알림 표시
   * @param {string} message - 메시지
   * @param {string} type - 타입 (success, error, warning, info)
   */
  showNotification(message, type = 'info') {
    // 간단한 알림 구현
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#50C878' : type === 'error' ? '#FF6B6B' : type === 'warning' ? '#FFA500' : '#4A90E2'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  },

  /**
   * 로딩 스피너 표시/숨김
   * @param {boolean} show - 표시 여부
   */
  toggleLoading(show) {
    let loader = document.getElementById('global-loader');
    
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = '<div class="loading-spinner"></div>';
        loader.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        `;
        document.body.appendChild(loader);
      }
      loader.style.display = 'flex';
    } else {
      if (loader) {
        loader.style.display = 'none';
      }
    }
  },

  /**
   * 깊은 복사
   * @param {*} obj - 복사할 객체
   * @returns {*} 복사된 객체
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 객체 병합
   * @param {Object} target - 대상 객체
   * @param {Object} source - 소스 객체
   * @returns {Object} 병합된 객체
   */
  mergeObjects(target, source) {
    return Object.assign({}, target, source);
  },

  /**
   * 빈 값 확인
   * @param {*} value - 확인할 값
   * @returns {boolean} 빈 값 여부
   */
  isEmpty(value) {
    return value === null || value === undefined || value === '' || 
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'object' && Object.keys(value).length === 0);
  },

  /**
   * 점수에 따른 별점 계산
   * @param {number} score - 점수 (0-100)
   * @returns {number} 별 개수 (0-3)
   */
  calculateStars(score) {
    if (score >= 90) return 3;
    if (score >= 70) return 2;
    if (score >= 60) return 1;
    return 0;
  },

  /**
   * 레벨에 따른 필요 경험치 계산
   * @param {number} level - 레벨
   * @returns {number} 필요 경험치
   */
  getRequiredXP(level) {
    return level * 100;
  },

  /**
   * 애니메이션 클래스 추가 후 제거
   * @param {HTMLElement} element - 요소
   * @param {string} animationClass - 애니메이션 클래스
   */
  animateElement(element, animationClass) {
    element.classList.add(animationClass);
    element.addEventListener('animationend', () => {
      element.classList.remove(animationClass);
    }, { once: true });
  }
};

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
