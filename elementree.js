const merge = require('nanomorph')
const onChange = require('on-change')
const ready = require('./ready')

let rendering = false
let root = null
let tree = null

function __renderer () {
  if (rendering) { return }
  rendering = true
  rendering = !merge(root, tree())
}

function attach (selector, prepared, app = {}) {
  const model = onChange(app, __renderer)
  tree = () => prepared(model)
  ready(() => {
    root = (typeof selector === 'string')
      ? document.querySelector(selector)
      : selector
    __renderer()
  })
}

function connect (template, state) {
  if (!state) return template
  const model = onChange(state, __renderer)
  return (...args) => template(model, ...args)
}

module.exports = {
  attach,
  connect,
  html: require('nanohtml/raw'),
  render: require('nanohtml')
}
