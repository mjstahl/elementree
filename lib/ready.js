export default function ready (callback) {
  const state = document.readyState
  if (state === 'complete' || state === 'interactive') {
    return setTimeout(callback, 0)
  }
  document.addEventListener('DOMContentLoaded', callback)
}
