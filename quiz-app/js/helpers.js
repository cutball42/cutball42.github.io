/**
 * helpers.js
 * 純粋ユーティリティ関数。グローバル QuizHelpers として公開。
 */

var QuizHelpers = (function () {

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function splitWord(word, suffix) {
    if (!suffix) return { stem: word, tail: '' };
    var raw = suffix.replace('-', '');
    var idx = word.lastIndexOf(raw);
    if (idx === -1) return { stem: word, tail: '' };
    return { stem: word.slice(0, idx), tail: word.slice(idx) };
  }

  function fmtTime(seconds) {
    return Number(seconds).toFixed(1);
  }

  return { shuffle: shuffle, splitWord: splitWord, fmtTime: fmtTime };
})();
