const { prepare, render } = require('../../lib/index')

module.exports =
  prepare((greeting) => render`<span>${greeting}</span>`)

