/**
 * components/QuizScreen.js
 * クイズ画面を描画。グローバル QuizScreen として公開。
 */

var QuizScreen = (function () {
  var POS     = QuizWords.POS;
  var CHOICES = QuizWords.CHOICES;
  var split   = QuizHelpers.splitWord;

  function buildWordDisplay(q, level, answered, isCorrect) {
    var parts = split(q.word, q.suffix);
    var hasSuffix = q.suffix !== '';

    if (!answered) {
      if (level === 1 && hasSuffix) {
        return '<div class="word-display">' + q.suffix + '</div>';
      }
      return '<div class="word-display">' + q.word + '</div>';
    }

    var wordHtml;
    if (hasSuffix) {
      wordHtml = '<div class="word-display">' +
        '<span class="word-stem">' + parts.stem + '</span>' +
        '<span class="word-tail">' + parts.tail + '</span>' +
        '</div>';
      if (level === 1) {
        wordHtml += '<div class="word-full-reveal">' + q.word + '</div>';
      }
    } else {
      wordHtml = '<div class="word-display">' + q.word + '</div>';
    }

    var feedbackHtml = isCorrect
      ? '<span class="feedback-tag ok">正解</span>'
      : '<span class="feedback-tag ng">不正解</span>' +
        '<span class="feedback-correct-label">正解：<strong>' + POS[q.pos].ja + '</strong></span>';

    return wordHtml +
      '<div class="word-ja">' + q.ja + '</div>' +
      '<div class="answer-feedback">' + feedbackHtml + '</div>';
  }

  function render(container, state, callbacks) {
    var q          = state.questions[state.idx];
    var answered   = state.answered;
    var selected   = state.selected;
    var level      = state.level;
    var isCorrect  = answered && selected === q.pos;
    var progress   = ((state.idx + (answered ? 1 : 0)) / state.questions.length) * 100;

    var choicesHtml = CHOICES.map(function (pos) {
      var cls = 'choice-btn';
      if (answered) {
        if (pos === selected && pos === q.pos)      cls += ' sel-correct';
        else if (pos === selected && pos !== q.pos) cls += ' sel-wrong';
        else if (pos === q.pos)                     cls += ' is-answer';
        else                                         cls += ' dimmed';
      }
      return '<button class="' + cls + '" data-pos="' + pos + '"' + (answered ? ' disabled' : '') + '>' +
        '<span class="c-ja">' + POS[pos].ja + '</span>' +
        '<span class="c-en">' + POS[pos].en + '</span>' +
        '</button>';
    }).join('');

    var nextRowHtml = answered
      ? '<div class="next-row">' +
          '<div class="space-hint"><span class="key-badge">Space</span> または</div>' +
          '<button class="next-btn" id="nextBtn">次へ →</button>' +
        '</div>'
      : '';

    var el = document.createElement('div');
    el.className = 'screen';
    el.innerHTML =
      '<div class="quiz-meta">' +
        '<div class="quiz-progress"><strong>' + (state.idx + 1) + '</strong> / ' + state.questions.length + '</div>' +
        '<div class="quiz-level-badge">Lv.' + level + '</div>' +
        '<div class="quiz-timer' + (answered ? ' recorded' : '') + '" id="quizTimer">' +
          (answered ? state.recordedTime + 's' : state.liveTime + 's') +
        '</div>' +
      '</div>' +
      '<div class="progress-bar-wrap"><div class="progress-bar" style="width:' + progress + '%"></div></div>' +
      '<div class="word-card' + (answered ? (isCorrect ? ' correct' : ' incorrect') : '') + '">' +
        buildWordDisplay(q, level, answered, isCorrect) +
      '</div>' +
      '<div class="choices">' + choicesHtml + '</div>' +
      nextRowHtml;

    el.querySelectorAll('[data-pos]').forEach(function (btn) {
      btn.addEventListener('click', function () { callbacks.onAnswer(btn.dataset.pos); });
    });
    var nextBtn = el.querySelector('#nextBtn');
    if (nextBtn) nextBtn.addEventListener('click', callbacks.onNext);

    container.appendChild(el);
  }

  function updateTimer(container, time) {
    var el = container.querySelector('#quizTimer');
    if (el && !el.classList.contains('recorded')) {
      el.textContent = time + 's';
    }
  }

  return { render: render, updateTimer: updateTimer };
})();
