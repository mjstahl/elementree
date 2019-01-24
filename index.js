const morph = require('nanomorph')
const ready = require('./ready')
const { Stated } = require('@mjstahl/stated')

function elementree (template, state) {
  const model = new Stated(state)

  return function (selector) {
    let parentTree = null
    model.on('transition', function (updatedModel) {
      morph(parentTree, template(updatedModel))
    })
    ready(function domReady () {
      parentTree = (typeof selector === 'string')
        ? document.querySelector(selector)
        : selector
      morph(parentTree, template(model))
    })
  }
}

module.exports = {
  couple: elementree,
  render: require('nanohtml'),
  raw: require('nanohtml/raw')
}
