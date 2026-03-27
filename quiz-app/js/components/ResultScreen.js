/**
 * components/ResultScreen.js
 * 結果・履歴画面を描画。グローバル ResultScreen として公開。
 */

var ResultScreen = (function () {
  var POS         = QuizWords.POS;
  var getLog      = QuizStorage.getLog;
  var formatDate  = QuizStorage.formatDate;

  var LEVEL_LABEL = { 1: 'Lv.1 語尾', 2: 'Lv.2 単語', 3: 'Lv.3 不規則' };

  function render(container, state, callbacks) {
    var results  = state.results;
    var level    = state.level;
    var correct  = results.filter(function (r) { return r.correct; }).length;
    var total    = results.length;
    var pct      = Math.round((correct / total) * 100);
    var avgTime  = (results.reduce(function (s, r) { return s + r.time; }, 0) / total).toFixed(1);
    var bestTime = Math.min.apply(null, results.map(function (r) { return r.time; })).toFixed(1);
    var miss     = total - correct;

    var log      = getLog();
    var logTotal = log.length;

    // Answer list
    var answerListHtml = results.map(function (r) {
      var ok = r.correct;
      var posHtml = ok
        ? '<span class="ok-pos">' + POS[r.answer].ja + '</span>'
        : '<span class="ng-pos">' + POS[r.selected].ja + '</span><span class="ok-pos">' + POS[r.answer].ja + '</span>';
      return '<div class="result-item">' +
        '<div class="r-dot ' + (ok ? 'ok' : 'ng') + '"></div>' +
        '<div style="flex:1;min-width:0">' +
          '<div class="r-word">' + r.word + '</div>' +
          '<div class="r-word-ja">' + r.ja + '</div>' +
        '</div>' +
        '<div class="r-pos">' + posHtml + '</div>' +
        '<div class="r-time">' + r.time.toFixed(1) + 's</div>' +
        '</div>';
    }).join('');

    // History log
    var logHtml = '';
    if (log.length > 0) {
      logHtml = log.slice(0, 8).map(function (entry, i) {
        var isCurrent = (i === 0);
        return '<div class="log-item' + (isCurrent ? ' current' : '') + '">' +
          '<span class="log-date">' + formatDate(entry.date) + '</span>' +
          (isCurrent ? '<span class="now-badge">今回</span>' : '') +
          '<span class="log-lv">Lv.' + entry.level + '</span>' +
          '<span class="log-score">' + entry.score + '/' + entry.total + '</span>' +
          '<span class="log-avgtime">avg ' + entry.avgTime + 's</span>' +
          '</div>';
      }).join('');
    }

    var el = document.createElement('div');
    el.className = 'screen';
    el.style.justifyContent = 'flex-start';
    el.style.paddingTop = '2.5rem';
    el.style.paddingBottom = '2.5rem';

    el.innerHTML =
      '<div class="result-header">' +
        '<div class="result-score">' + correct + '<span class="r-denom"> / ' + total + '</span></div>' +
        '<div class="result-pct">正答率 ' + pct + '% | ' + LEVEL_LABEL[level] + '</div>' +
      '</div>' +
      '<div class="result-stats">' +
        '<div class="r-stat"><span class="sv">' + avgTime + 's</span><div class="sl">平均タイム</div></div>' +
        '<div class="r-stat"><span class="sv">' + bestTime + 's</span><div class="sl">最速</div></div>' +
        '<div class="r-stat"><span class="sv">' + miss + '</span><div class="sl">ミス</div></div>' +
      '</div>' +
      '<div class="section-label" style="margin-bottom:.5rem">回答内訳</div>' +
      '<div class="result-list">' + answerListHtml + '</div>' +
      (log.length > 0
        ? '<div class="log-section">' +
            '<div class="log-header">' +
              '<div class="section-label" style="margin-bottom:0">履歴</div>' +
              '<div class="log-count">累計 ' + logTotal + ' 回</div>' +
            '</div>' +
            '<div class="log-list" style="margin-top:.5rem">' + logHtml + '</div>' +
          '</div>'
        : '') +
      '<button class="restart-btn" id="restartBtn">もう一度</button>';

    el.querySelector('#restartBtn').addEventListener('click', callbacks.onRestart);
    container.appendChild(el);
  }

  return { render: render };
})();
