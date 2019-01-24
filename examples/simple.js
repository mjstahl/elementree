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

function template ({ actions, to, value }) {
  return render`
    <body>
      <p>${value}</p>
      <button onclick=${toggle}>
        toggle
      </button>
    </body>
  `

  function toggle () {
    to(actions.TOGGLE)
  }
}

couple(template, state)('body')
