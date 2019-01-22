const { couple, render } = require('../index')

const state = {
  initial: {
    value: 'Hello',
    GOODBYE: 'goodbye'
  },
  goodbye: {
    value: 'Goodbye'
  }
}

function template (app, model) {
  return render`
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

couple(template, state)('body')
