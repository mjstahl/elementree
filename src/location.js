const onchange = require('on-change')
require('onpushstate')

const { hash, pathname, search } = window.location
const location = { path: pathname + search + hash }
let fromBrowser = false
let fromCode = false
let observer = null

Array.from(['pushState', 'replaceState'], (fn) => {
  const stateFn = window.history[fn]
  window.history[fn] = function () {
    stateFn.apply(window.history, arguments)
    window[`on${fn.toLowerCase()}`].apply(window.history, arguments)
  }
})

function onBrowserChange () {
  if (fromCode) return

  fromBrowser = true
  const { hash, pathname, search } = window.location
  observer.path = pathname + search + hash
  fromBrowser = false
}

function onProgramaticChange (value) {
  if (fromBrowser) return

  fromCode = true
  window.history.pushState({ path: value }, null, value)
  fromCode = false
}

window.onpopstate =
window.onpushstate =
window.onreplacestate =
  onBrowserChange

module.exports = (callback) => {
  if (observer) return observer
  observer = onchange(location, (_, value) => {
    onProgramaticChange(value)
    callback(observer)
  })
  callback(location)
  return observer
}
