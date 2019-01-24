const { attach, couple, render } = require('../../index')
const sunmoon = require('./sunmoon')

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
      <p>${value} ${sunmoon(value)}</p>
      <button onclick=${toggle}>
        toggle
      </button>
    </body>
  `

  function toggle () {
    to(actions.TOGGLE)
  }
}

const toRender = couple(template, state)
const routes = {
  '/toggle/index.html': toRender,
  '/hello': function () { console.log(args) }
}

attach('body', routes)
