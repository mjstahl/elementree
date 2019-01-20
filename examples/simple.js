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

function template (model) {
  return html`
    <body>
      <p>${model.value}</p>
      <button onclick=${signoff} ${model.state === 'goodbye' && 'disabled'}>
        World
      </button>
      <button onclick=${reset}>
        Reset
      </button>
    </body>
  `

  function reset () {
    model.initial()
  }

  function signoff () {
    model.to(model.actions.GOODBYE)
  }
}

elementree(template, state)('body')
