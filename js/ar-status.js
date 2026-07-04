/**
 * AR 상태 배너 (마커 / 마커리스 공통)
 * 외부 JS 로드 실패 시에도 HTML 인라인에서 이 파일을 먼저 로드
 */
(function () {
  function bindDismiss(el) {
    if (!el || el.dataset.dismissBound) return;
    el.dataset.dismissBound = '1';
    el.style.cursor = 'pointer';
    el.addEventListener('click', function () {
      el.style.display = 'none';
    });
  }

  function scheduleHide(el, ms) {
    if (!el) return;
    setTimeout(function () {
      el.style.display = 'none';
    }, ms);
  }

  window.ARStatus = {
    _markerlessInit: false,
    _markerInit: false,

    initMarkerless() {
      if (this._markerlessInit) return;
      this._markerlessInit = true;
      var el = document.getElementById('plane-status');
      if (!el) return;

      function showReady(cameraOn) {
        el.style.display = 'block';
        if (cameraOn) {
          el.innerHTML =
            '<p>📷 카메라 준비 완료!</p>' +
            '<p class="hint">화면 가운데를 터치하세요 (탭하면 닫기)</p>';
        } else {
          el.innerHTML =
            '<p>👆 화면을 터치하세요</p>' +
            '<p class="hint">가운데를 탭하면 도형이 배치됩니다 (탭하면 닫기)</p>';
        }
        bindDismiss(el);
      }

      showReady(false);
      setTimeout(function () { showReady(false); }, 400);

      window.addEventListener('arjs-video-loaded', function () {
        showReady(true);
      });

      scheduleHide(el, 7000);
    },

    initMarker() {
      if (this._markerInit) return;
      this._markerInit = true;
      var el = document.getElementById('marker-status');
      if (!el) return;

      function showReady(cameraOn) {
        el.style.display = 'block';
        if (cameraOn) {
          el.innerHTML =
            '<p>📷 카메라 준비 완료!</p>' +
            '<p class="hint">Hiro·Kanji·A 마커를 비춰주세요 (탭하면 닫기)</p>';
          el.classList.add('found');
        } else {
          el.innerHTML =
            '<p>📷 마커 AR 준비 중...</p>' +
            '<p class="hint">마커를 인쇄하거나 화면에 띄워 비춰주세요 (탭하면 닫기)</p>';
        }
        bindDismiss(el);
      }

      showReady(false);
      setTimeout(function () { showReady(true); }, 2000);

      window.addEventListener('arjs-video-loaded', function () {
        showReady(true);
      });

      scheduleHide(el, 9000);
    }
  };

  function boot() {
    var path = window.location.pathname || '';
    if (path.indexOf('ar-markerless') !== -1) {
      window.ARStatus.initMarkerless();
    } else if (path.indexOf('ar-marker') !== -1) {
      window.ARStatus.initMarker();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
