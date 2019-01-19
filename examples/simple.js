const { elementree, html, State } = require('../index')

const state = new State({
  initial: {
    value: 'Hello',
    GOODBYE: 'goodbye'
  },
  goodbye: {
    value: 'Goodbye'
  }
})

function template ({ actions, initial, to, value }) {
  return html`
    <p>${value}</p>
    <button onclick=${signoff}>World</button>
    <button onclick=${reset}>Reset</button>
  `

  function reset () {
    initial()
  }

  function signoff () {
    to(actions.GOODBYE)
  }
}

const tree = elementree(template)(state)
document.body.appendChild(tree)
