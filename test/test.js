const test = require('ava')
const ready = require('../ready')
const { attach, couple, render } = require('../index')

test.cb('simple rendering of a paragraph', t => {
  t.plan(1)
  const state = {
    initial: 'test',
    test: { value: 'Hello' }
  }
  function template ({ value }) {
    return render`
      <body>
        <p>${value}</p>
      </body>
    `
  }
  couple(template, state)
  attach('body')
  ready(function () {
    t.is(document.querySelector('p').innerHTML, state.test.value)
    t.end()
  })
})
