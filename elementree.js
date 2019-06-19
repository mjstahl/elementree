const mutate = require('nanomorph')
const renderHTML = require('nanohtml')
const locationChanged = require('./location')

const create = require('./create')
const ready = require('./ready')

const ExprCache = new WeakMap()

let AppState = null
let RouteState = null
let root = null
let tree = null
let rendering = false

function renderAndMutate (property, updated) {
  const appStateUpdated = this === AppState && updated
  if (RouteState && appStateUpdated && property === 'route') {
    RouteState.path = updated
  }

  if (rendering) return

  rendering = true
  rendering = !mutate(root, tree())
}

function merge (selector, prepared, appState = {}) {
  rendering = true

  AppState = create(appState, renderAndMutate)
  RouteState = locationChanged(({ path }) => {
    AppState.route = path
  })

  const rootTemplate = prepared(AppState)
  const rootState = (rootTemplate.initWith)
    ? create(rootTemplate.initWith, renderAndMutate)
    : undefined
  tree = () => rootTemplate(rootState)

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
    function callWithState (state) {
      return (state) ? template(state, ...args) : template(...args)
    }
    callWithState.callable = true
    callWithState.initWith = state
    return callWithState
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
    if (!e || !e.callable) return e
    return (e.initWith) ? e(values[i]) : e()
  })
  return renderHTML(strings, ...evaluated)
}

module.exports = {
  html: require('nanohtml/raw'),
  merge,
  prepare,
  render
}
