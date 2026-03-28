/**
 * app.js
 * アプリケーション状態管理・画面遷移。
 * 他の全スクリプトが読み込まれた後に実行される。
 */

(function () {
  var REGULAR   = QuizWords.REGULAR_WORDS;
  var IRREGULAR = QuizWords.IRREGULAR_WORDS;
  var shuffle   = QuizHelpers.shuffle;
  var fmtTime   = QuizHelpers.fmtTime;
  var saveResult = QuizStorage.saveResult;

  // ── State ─────────────────────────────────────────────────────────────────
  var state = {
    phase:        'start',
    numQ:         10,
    level:        1,
    questions:    [],
    idx:          0,
    answered:     false,
    selected:     null,
    results:      [],
    startTime:    null,
    liveTime:     '0.0',
    recordedTime: '0.0',
  };

  var timerInterval = null;
  var app = document.getElementById('app');

  // ── Render ────────────────────────────────────────────────────────────────
  function render() {
    app.innerHTML = '';

    if (state.phase === 'start') {
      StartScreen.render(app, state, {
        setNumQ:  function (n) { state.numQ = n; render(); },
        setLevel: function (l) { state.level = l; render(); },
        onStart:  startGame,
      });

    } else if (state.phase === 'quiz') {
      QuizScreen.render(app, state, {
        onAnswer: handleAnswer,
        onNext:   advance,
      });
      if (!state.answered) startTimer();

    } else if (state.phase === 'result') {
      ResultScreen.render(app, state, {
        onRestart: function () { state.phase = 'start'; render(); },
      });
    }
  }

  // ── Timer ─────────────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(timerInterval);
    state.startTime = Date.now();
    state.liveTime  = '0.0';

    timerInterval = setInterval(function () {
      state.liveTime = fmtTime((Date.now() - state.startTime) / 1000);
      QuizScreen.updateTimer(app, state.liveTime);
    }, 100);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    state.recordedTime = fmtTime((Date.now() - state.startTime) / 1000);
  }

  // ── Game flow ─────────────────────────────────────────────────────────────
  function startGame() {
    var pool = state.level === 3 ? IRREGULAR : REGULAR;
    state.questions    = shuffle(pool).slice(0, state.numQ);
    state.idx          = 0;
    state.results      = [];
    state.answered     = false;
    state.selected     = null;
    state.liveTime     = '0.0';
    state.recordedTime = '0.0';
    state.phase        = 'quiz';
    render();
  }

  function handleAnswer(pos) {
    if (state.answered) return;
    stopTimer();

    var q = state.questions[state.idx];
    state.selected = pos;
    state.answered = true;
    state.results.push({
      word:     q.word,
      suffix:   q.suffix,
      ja:       q.ja,
      pos:      q.pos,
      answer:   q.pos,
      selected: pos,
      correct:  pos === q.pos,
      time:     parseFloat(state.recordedTime),
    });

    render();
  }

  function advance() {
    if (!state.answered) return;

    if (state.idx + 1 >= state.questions.length) {
      var results = state.results;
      var correct = results.filter(function (r) { return r.correct; }).length;
      var avg = parseFloat(
        (results.reduce(function (s, r) { return s + r.time; }, 0) / results.length).toFixed(1)
      );
      saveResult({
        date:    new Date().toISOString(),
        score:   correct,
        total:   results.length,
        avgTime: avg,
        level:   state.level,
      });
      state.phase = 'result';
      render();
    } else {
      state.idx++;
      state.answered     = false;
      state.selected     = null;
      state.liveTime     = '0.0';
      state.recordedTime = '0.0';
      render();
    }
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────
  document.addEventListener('keydown', function (e) {
    if (e.code === 'Space' && state.phase === 'quiz' && state.answered) {
      e.preventDefault();
      advance();
    }
  });

  // ── Boot ──────────────────────────────────────────────────────────────────
  render();
})();
