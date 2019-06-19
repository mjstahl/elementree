const mutate = require('nanomorph')
const renderHTML = require('nanohtml')
const locationChanged = require('location-changed')

const create = require('./create')
const ready = require('./ready')

const ExprCache = new WeakMap()

let AppModel = null
let RouteModel = null
let root = null
let tree = null
let rendering = false

function renderAndMutate (property, updated) {
  const appModelUpdated = this === AppModel && updated
  if (RouteModel && appModelUpdated && property === 'route') {
    RouteModel.path = updated
  }

  if (rendering) return

  rendering = true
  rendering = !mutate(root, tree())
}

function merge (selector, prepared, appState = {}) {
  rendering = true

  AppModel = create(appState, renderAndMutate)
  RouteModel = locationChanged(({ path }) => {
    AppModel.route = path
  })

  const rootTemplate = prepared(AppModel)
  const rootModel = (rootTemplate.initWith)
    ? create(rootTemplate.initWith, renderAndMutate)
    : undefined
  tree = () => rootTemplate(rootModel)

  if (typeof window !== 'object') {
    return tree().outerHTML
  }

  rendering = false
  ready(() => {
    root = document.querySelector(selector)
    renderAndMutate()
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
  const values = ExprCache.get(strings) || exprs.map(e => {
    return (e && e.callable && e.initWith)
      ? create(e.initWith, renderAndMutate)
      : e
  })
  ExprCache.set(strings, values)

  const evaluated = exprs.map((e, i) => {
    return (e && e.callable) ? e(values[i]) : e
  })
  return renderHTML(strings, ...evaluated)
}

module.exports = {
  html: require('nanohtml/raw'),
  merge,
  prepare,
  render
}
