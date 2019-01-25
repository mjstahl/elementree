const merge = require('nanomorph')
const { Stated } = require('@mjstahl/stated')

const ready = require('./ready')
const routes = require('./routes')

let parentTree; let rendering = false; let root; let router
function attach (selector, paths) {
  if (paths) {
    router = routes(paths)
    router.onTransition(({ value }) => {
      root = value.view
      merge(parentTree, root(value))
    })
    window.ROUTE = router
  }
  ready(() => {
    parentTree = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    merge(parentTree, root())
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
    rendering = !merge(parentTree, root())
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
