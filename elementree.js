const __merge = require('nanomorph')
const __render = require('nanohtml')
const locationChanged = require('location-changed')
const onchange = require('on-change')

const ready = require('./ready')

let AppModel = null
const exprCache = new WeakMap()
let rendering = false
let root = null
let RouteModel = null
let tree = null

function __newModel (Model, callback = __renderTree) {
  const instance = (Model.prototype) ? new Model() : Model()
  return onchange(instance, callback)
}

function __renderTree (property, updated) {
  if (rendering) { return }

  const appModelUpdated = updated && this === AppModel
  if (appModelUpdated && property === 'route') {
    RouteModel.path = updated
  }

  rendering = true
  rendering = !__merge(root, tree())
}

function merge (selector, prepared, appState = () => ({})) {
  rendering = true

  AppModel = __newModel(appState)
  RouteModel = locationChanged(({ path }) => {
    AppModel.route = path
  })

  const rootTemplate = prepared(AppModel)
  const rootModel = (rootTemplate.initWith)
    ? __newModel(rootTemplate.initWith)
    : undefined
  tree = () => rootTemplate(rootModel)

  if (typeof window !== 'object') {
    return tree().outerHTML
  }

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
