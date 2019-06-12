const __merge = require('nanomorph')
const __render = require('nanohtml')
const locationChanged = require('location-changed')
const onchange = require('on-change')
const ready = require('./ready')

const ExprCache = new WeakMap()

let AppModel = null
let RouteModel = null

let root = null
let tree = null

let rendering = false

function __newModel (model, callback = __renderTree) {
  let Model = model
  if (typeof Model !== 'function') Model = function () { return model }

  const instance = (Model.prototype) ? new Model() : Model()
  return onchange(instance, callback)
}

function __renderTree (property, updated) {
  const appModelUpdated = updated && this === AppModel
  if (RouteModel && appModelUpdated && property === 'route') {
    RouteModel.path = updated
  }

  if (rendering) return

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
  let values = ExprCache.get(strings)
  if (!values) {
    values = exprs.map(e => {
      return (e && e.callable && e.initWith) ? __newModel(e.initWith) : e
    })
    ExprCache.set(strings, values)
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
