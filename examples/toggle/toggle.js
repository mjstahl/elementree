const { attach, prepare, ready, render } = require('../../index')
const greeting = require('./greeting')
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

function toggle ({ actions, to, value }, app) {
  return render`
    <body>
      <p>${greeting(value)} ${sunmoon(value)}</p>
      <button onclick=${onToggle}>
        toggle
      </button>
    </body>
  `

  function onToggle () {
    to(actions.TOGGLE)
  }
}

function hello (app) {
  return render`
    <body>
      <h1>HEEELLLOOO</h1>
    </body>
  `
}

attach('body', prepare(toggle, state))

// const app = { firstname: "Mark" }
// const routes = {
//   '/toggle/index.html': prepare(toggle, state),
//   '/hello': prepare(hello)
// }
// ready(function () {
//   attach(document.body, routes, app)
// })
