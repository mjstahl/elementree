module.exports = function ready(callback) {
  var state = document.readyState
  if (state === 'complete' || state === 'interactive') {
    setTimeout(callback, 0)
  }
  document.addEventListener('DOMContentLoaded', callback)
}