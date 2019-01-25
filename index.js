const morph = require('nanomorph')
const ready = require('./ready')
const routes = require('./routes')
const { Stated } = require('@mjstahl/stated')

let parentTree, rendering = false, root, router
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

function prepare (template, state) {
  let model
  if (state) {
    model = (state instanceof Stated) ? state : new Stated(state)
  }
  model && model.onTransition(() => {
    if (rendering) { return }
    rendering = true
    rendering = !morph(parentTree, root())
  })
  root = function () {
    return (model)
      ? template(model, ...arguments)
      : template(...arguments)
  }
  return root
}

module.exports = {
  attach,
  html: require('nanohtml/raw'),
  prepare,
  ready,
  render: require('nanohtml'),
  state: Stated
}
