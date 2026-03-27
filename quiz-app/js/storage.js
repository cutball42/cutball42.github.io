/**
 * storage.js
 * localStorage によるクイズ履歴管理。グローバル QuizStorage として公開。
 */

var QuizStorage = (function () {
  var KEY = 'suffix_quiz_log';
  var MAX_ENTRIES = 100;

  function getLog() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveResult(entry) {
    try {
      var log = getLog();
      log.unshift(entry);
      if (log.length > MAX_ENTRIES) log.length = MAX_ENTRIES;
      localStorage.setItem(KEY, JSON.stringify(log));
    } catch (e) {
      // localStorage 利用不可の場合は無視
    }
  }

  function getTotalAttempts() {
    return getLog().length;
  }

  function formatDate(iso) {
    var d = new Date(iso);
    var pad = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) +
           ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  return {
    getLog: getLog,
    saveResult: saveResult,
    getTotalAttempts: getTotalAttempts,
    formatDate: formatDate,
  };
})();
