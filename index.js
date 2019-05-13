const merge = require('nanomorph')

const StateMachine = require('./state')
const ready = require('./ready')
const { register, route, view } = require('./router')

let parentTree = null
let rendering = false
let root = null

function attach (selector, paths, app = {}) {
  if (typeof paths === 'function') {
    root = () => paths(app)
  } else {
    let routes = register(paths, app)
    routes.onTransition((updated) => {
      root = () => view(updated)(updated.value)
      merge(parentTree, root())
    })
    root = () => view(routes)(routes.value)
  }
  ready(() => {
    parentTree = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    rendering = true
    rendering = !merge(parentTree, root())
  })
}

function forceUpdate () {
  merge(parentTree, root())
}

function prepare (template, state) {
  if (!state) return (...args) => template(...args)
  if (!state.initial) {
    throw new Error(`The model for "${template.name}" must define an "initial" state.`)
  }
  let model = new StateMachine(state)
  model && model.onTransition(() => {
    if (rendering) { return }
    rendering = true
    rendering = !merge(parentTree, root())
  })
  return (...args) => template(model, ...args)
}

module.exports = {
  attach,
  forceUpdate,
  html: require('nanohtml/raw'),
  prepare,
  ready,
  render: require('nanohtml'),
  route
}
