import raw from 'nanohtml/raw'
import mutate from 'nanomorph'
import renderHTML from 'nanohtml'
import onChange from 'on-change'

import locationChanged from './location'
import ready from './ready'

const ExprCache = new WeakMap()

let AppState = null
let RouteState = null
let root = null
let tree = null
let rendering = false

function create (state, callback) {
  const State = (() => state)()
  return onChange(State, callback)
}

function renderAndMutate (property, updated) {
  const appStateUpdated = this === AppState && updated
  if (RouteState && appStateUpdated && property === 'route') {
    RouteState.path = updated
  }

  if (rendering) return

  rendering = true
  const updatedTree = tree()
  if (updatedTree instanceof Promise) {
    updatedTree.then(function (u) { rendering = !mutate(root, u) })
  } else {
    rendering = !mutate(root, updatedTree)
  }
}

export const html = raw

export function merge (selector, prepared, appState = {}) {
  rendering = true

  AppState = create(appState, renderAndMutate)
  RouteState = locationChanged(({ path }) => {
    AppState.route = path
  })

  const rootView = prepared(AppState)
  const rootState = (rootView.initWith)
    ? create(rootView.initWith, renderAndMutate)
    : undefined
  tree = () => rootView(rootState)

  rendering = false
  ready(() => {
    root = document.querySelector(selector)
    renderAndMutate()
  })
}

export function prepare (view, state) {
  return (...args) => {
    function callWithState (state) {
      return (state) ? view(state, ...args) : view(...args)
    }
    callWithState.callable = true
    callWithState.initWith = state
    return callWithState
  }
}

export function render (strings, ...exprs) {
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

export default {
  html,
  merge,
  prepare,
  render
}
