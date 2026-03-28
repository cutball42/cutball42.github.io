/**
 * components/StartScreen.js
 * スタート画面を描画。グローバル StartScreen として公開。
 */

var StartScreen = (function () {
  var NUM_OPTIONS = [10, 20, 30, 50];

  var LEVEL_META = [
    { num: 1, example: '-tion', hint: '語尾のみ表示<br>接尾辞で判断' },
    { num: 2, example: 'education', hint: '単語全体を表示<br>語彙力で判断' },
    { num: 3, example: 'launch...', hint: '語尾ルール外<br>純粋な語彙テスト' },
  ];

  function render(container, state, callbacks) {
    var el = document.createElement('div');
    el.className = 'screen';

    var pillsHtml = NUM_OPTIONS.map(function (n) {
      return '<button class="pill' + (state.numQ === n ? ' active' : '') + '" data-numq="' + n + '">' + n + '問</button>';
    }).join('');

    var cardsHtml = LEVEL_META.map(function (lv) {
      return '<button class="level-card' + (state.level === lv.num ? ' active' : '') + '" data-level="' + lv.num + '">' +
        '<span class="lv-num">Lv.' + lv.num + '</span>' +
        '<span class="lv-example">' + lv.example + '</span>' +
        '<span class="lv-hint">' + lv.hint + '</span>' +
        '</button>';
    }).join('');

    el.innerHTML =
      '<div class="start-title">品詞クイズ</div>' +
      '<div class="start-sub">PARTS OF SPEECH</div>' +
      '<div class="section-label">問題数</div>' +
      '<div class="pill-group">' + pillsHtml + '</div>' +
      '<div class="section-label">レベル</div>' +
      '<div class="level-cards">' + cardsHtml + '</div>' +
      '<button class="start-btn" id="startBtn">スタート</button>';

    el.querySelectorAll('[data-numq]').forEach(function (btn) {
      btn.addEventListener('click', function () { callbacks.setNumQ(Number(btn.dataset.numq)); });
    });
    el.querySelectorAll('[data-level]').forEach(function (btn) {
      btn.addEventListener('click', function () { callbacks.setLevel(Number(btn.dataset.level)); });
    });
    el.querySelector('#startBtn').addEventListener('click', callbacks.onStart);

    container.appendChild(el);
  }

  return { render: render };
})();
