const { Stated } = require('@mjstahl/stated')
const html = require('nanohtml')
const raw = require('nanohtml/raw')

function elementree (state, template) {
  state.on('transition', template)
  return template(state)
}

module.exports = {
  elementree,
  html,
  raw,
  State: Stated
}
