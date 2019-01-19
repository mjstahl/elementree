const morph = require('nanomorph')
const ready = require('document-ready')

function elementree (template, state) {
  return function (selector) {
    let parentTree = null
    state.on('transition', function (updatedState) {
      morph(parentTree, template(updatedState))
    })
    ready(function () {
      parentTree = (typeof selector === 'string')
        ? document.querySelector(selector)
        : selector
      morph(parentTree, template(state))
    })
  }
}

module.exports = {
  elementree,
  html: require('nanohtml'),
  raw: require('nanohtml/raw'),
  State: require('@mjstahl/stated').Stated
}
