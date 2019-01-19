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

function template (stated) {
  return html`
    <body>
      <p>${stated.value}</p>
      <button onclick=${signoff} ${stated.state === 'goodbye' && 'disabled'}>
        World
      </button>
      <button onclick=${reset}>
        Reset
      </button>
    </body>
  `

  function reset () {
    stated.initial()
  }

  function signoff () {
    stated.to(stated.actions.GOODBYE)
  }
}

elementree(template, state)('body')
