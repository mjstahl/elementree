const __merge = require('nanomorph')
const __render = require('nanohtml')
const locationChanged = require('location-changed')
const onchange = require('on-change')

const ready = require('./ready')

const exprCache = new WeakMap()
let rendering = false
let root = null
let tree = null

function __newModel (Model) {
  const instance = (Model.prototype) ? new Model() : Model()
  return onchange(instance, __renderTree)
}

function __renderTree () {
  if (rendering) { return }
  rendering = true
  rendering = !__merge(root, tree())
}

function merge (selector, prepared, appState = {}) {
  rendering = true

  const appModel = (typeof appState === 'function')
    ? __newModel(appState)
    : onchange(appState, __renderTree)
  locationChanged((path) => {
    if (!appModel.route) appModel.route = {}
    appModel.route.path = path
  })

  const rootTemplate = prepared(appModel)
  const rootModel = (rootTemplate.initWith)
    ? __newModel(rootTemplate.initWith)
    : undefined
  tree = () => rootTemplate(rootModel)

  rendering = false
  ready(() => {
    root = document.querySelector(selector)
    __renderTree()
  })
}

function prepare (template, state) {
  return (...args) => {
    function callWithModel (model) {
      return (model) ? template(model, ...args) : template(...args)
    }
    callWithModel.callable = true
    callWithModel.initWith = state
    return callWithModel
  }
}

function render (strings, ...exprs) {
  let values = exprCache.get(strings)
  if (!values) {
    values = exprs.map(e => {
      return (e && e.callable && e.initWith) ? __newModel(e.initWith) : e
    })
    exprCache.set(strings, values)
  }
  const evaluated = exprs.map((e, i) => {
    return (e && e.callable) ? e(values[i]) : e
  })
  return __render(strings, ...evaluated)
}

module.exports = {
  html: require('nanohtml/raw'),
  merge,
  prepare,
  render
}
