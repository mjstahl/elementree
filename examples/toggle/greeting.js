const { couple, render } = require('../../index')

module.exports =
  couple((greeting) => render`<span>${greeting}</span>`)

