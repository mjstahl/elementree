const __merge = require('nanomorph')
const __render = require('nanohtml')
const clone = require('lodash.clonedeep')
const onChange = require('on-change')

const ready = require('./ready')

const exprCache = new WeakMap()
let rendering = false
let root = null
let tree = null

function __newModel (model) {
  const instance = (typeof model === 'function')
    ? new model()
    : clone(model)
  return onChange(instance, __renderTree)
}

function __renderTree () {
  if (rendering) { return }
  rendering = true
  rendering = !__merge(root, tree())
}

function merge (selector, prepared, appState = {}) {
  const app = prepared(__newModel(appState))
  const model = (app.initWith)
    ? __newModel(app.initWith)
    : undefined
  tree = () => app(model)
  ready(() => {
    root = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    __renderTree()
  })
}

function join (template, state) {
  return (...args) => {
    function callWithModel (model) {
      return (model)
        ? template(model, ...args)
        : template(...args)
    }
    callWithModel.initWith = state
    return callWithModel
  }
}

function render (strings, ...exprs) {
  let values = exprCache.get(strings)
  if (!values) {
    values = exprs.map(e => {
      if (!e || e.name !== 'callWithModel') return e
      return __newModel(e.initWith)
    })
    exprCache.set(strings, values)
  }
  const evaluated = exprs.map((e, i) => {
    return (e && e.name === 'callWithModel')
      ? e(values[i])
      : e
  })
  return __render(strings, ...evaluated)
}

module.exports = {
  html: require('nanohtml/raw'),
  join,
  merge,
  render,
}
