const morph = require('nanomorph')
const ready = require('./ready')
const routes = require('./routes')
const stated = require('@mjstahl/stated')

let parentTree, root, router
function attach (selector, paths) {
  if (paths) {
    router = routes(paths)
    router.onTransition(() => { })
    // window.ROUTE = router
  }
  ready(() => {
    parentTree = document.querySelector(selector)
    morph(parentTree, root())
  })
}

function couple (template, state) {
  const model = stated(state)
  model.onTransition(() => morph(parentTree, root()))
  root = function () {
    return template(model, ...arguments)
  }
  return root
}

module.exports = {
  attach,
  couple,
  raw: require('nanohtml/raw'),
  render: require('nanohtml'),
  state: stated
}
