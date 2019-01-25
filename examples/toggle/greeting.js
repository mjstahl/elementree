const { prepare, render } = require('../../index')

module.exports =
  prepare((greeting) => render`<span>${greeting}</span>`)

