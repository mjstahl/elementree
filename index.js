const morph = require('nanomorph')
const ready = require('./ready')
const routes = require('./routes')
const { Stated } = require('@mjstahl/stated')

let parentTree; let rendering = false; let root; let router
function attach (selector, paths) {
  if (paths) {
    router = routes(paths)
    router.onTransition(({ value }) => {
      root = value.view
      morph(parentTree, root(value))
    })
    window.ROUTE = router
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
  route: null,
  state: Stated
}
