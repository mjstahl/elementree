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
    parentTree = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    morph(parentTree, root())
  })
}

function couple (template, state) {
  const model = state ? stated(state) : undefined
  model && model.onTransition(() => morph(parentTree, root()))
  root = function () {
    return (model)
      ? template(model, ...arguments)
      : template(...arguments)
  }
  return root
}

module.exports = {
  attach,
  couple,
  html: require('nanohtml/raw'),
  ready,
  render: require('nanohtml'),
  state: stated
}
