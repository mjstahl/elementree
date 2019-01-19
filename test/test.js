const test = require('ava')
const ready = require('document-ready')
const { elementree, html, State } = require('../index')

test.cb('simple rendering of a paragraph', t => {
  t.plan(1)
  const state = new State({
    initial: {
      value: 'Hello'
    }
  })
  function template ({ value }) {
    return html`
      <body>
        <p>${value}</p>
      </body>
    `
  }
  elementree(template, state)('body')

  ready(function () {
    t.is(document.querySelector('p').innerHTML, state.value)
    t.end()
  })
})
