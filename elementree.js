const __merge = require('nanomorph')
const onChange = require('on-change')
const ready = require('./ready')

let rendering = false
let root = null
let tree = null

function __renderer () {
  if (rendering) { return }
  rendering = true
  rendering = !__merge(root, tree())
}

function merge (selector, prepared, app = {}) {
  const model = onChange(app, __renderer)
  tree = () => prepared(model)
  ready(() => {
    root = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    __renderer()
  })
}

function join (template, state) {
  if (!state) return template
  const model = onChange(state, __renderer)
  return (...args) => template(model, ...args)
}

module.exports = {
  html: require('nanohtml/raw'),
  join,
  merge,
  render: require('nanohtml')
}
