const __merge = require('nanomorph')
const __renderTemplate = require('nanohtml')
const clone = require('lodash.clonedeep')
const onChange = require('on-change')

const ready = require('./ready')

const exprCache = new WeakMap()
let rendering = false
let root = null
let tree = null

function __renderTree () {
  if (rendering) { return }
  rendering = true
  rendering = !__merge(root, tree())
}

function merge (selector, prepared, app = {}) {
  const appTemplate = prepared(onChange(app, __renderTree))
  const model = (appTemplate.initWith)
    ? onChange(appTemplate.initWith, __renderTree)
    : undefined
  tree = () => appTemplate(model)
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
      return (e && e.name === 'callWithModel')
        ? onChange(clone(e.initWith), __renderTree)
        : e
    })
    exprCache.set(strings, values)
  }
  const evaluated = exprs.map((e, i) => {
    return (e && e.name === 'callWithModel')
      ? e(values[i])
      : e
  })
  return __renderTemplate(strings, ...evaluated)
}

module.exports = {
  html: require('nanohtml/raw'),
  join,
  merge,
  render,
}
