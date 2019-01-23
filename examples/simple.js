const { couple, render } = require('../index')

const state = {
  initial: 'hello',
  hello: {
    value: 'Hello',
    TOGGLE: 'goodbye'
  },
  goodbye: {
    value: 'Goodbye',
    TOGGLE: 'hello'
  }
}

function template (app, model) {
  return render`
    <body>
      <p>${model.value}</p>
      <button onclick=${toggle}>
        toggle
      </button>
    </body>
  `

  function toggle () {
    model.to(model.actions.TOGGLE)
  }
}

couple(template, state)('body')
