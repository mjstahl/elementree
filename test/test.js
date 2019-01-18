const test = require('ava')
const { elementree, html, State } = require('../index')

test('simple rendering of a paragraph', t => {
  const state = new State({
    initial: {
      value: 'Hello'
    }
  })
  function template ({ value }) {
    return html`
      <p>${value}</p>
    `
  }
  document.body.appendChild(elementree(template)(state))
  t.is(document.querySelector('p').innerHTML, state.value)
})
