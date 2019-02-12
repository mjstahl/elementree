const merge = require('nanomorph')
const { Stated } = require('@mjstahl/stated')

const ready = require('./ready')
const { register, route, view } = require('./router')

let parentTree = null
let rendering = false
let root = null

function attach (selector, paths, app = {}) {
  let routes
  if (typeof paths === 'function') {
    root = () => paths(app)
  } else {
    routes = register(paths, app)
    routes.onTransition((updated) => {
      root = view(updated)
      merge(parentTree, root(updated.value))
    })
    root = () => view(routes)(routes.value)
  }
  ready(() => {
    parentTree = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    merge(parentTree, root())
  })
}

function forceUpdate () {
  merge(parentTree, root())
}

function prepare (template, state) {
  let model; let name = template.name
  if (state) {
    if (!state.initial) {
      throw new Error(`The model for "${name}" must define an "initial" state.`)
    }
    model = (state instanceof Stated) ? state : new Stated(state)
  }
  model && model.onTransition(() => {
    if (rendering) { return }
    rendering = true
    rendering = !merge(parentTree, root())
  })
  return function () {
    return (model)
      ? template(model, ...arguments)
      : template(...arguments)
  }
}

module.exports = {
  attach,
  forceUpdate,
  html: require('nanohtml/raw'),
  prepare,
  ready,
  render: require('nanohtml'),
  route,
  State: Stated
}
