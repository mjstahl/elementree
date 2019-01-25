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

function template ({ actions, to, value }) {
  return render`
    <body>
      <p>${greeting(value)} ${sunmoon(value)}</p>
      <button onclick=${toggle}>
        toggle
      </button>
    </body>
  `

  function toggle () {
    to(actions.TOGGLE)
  }
}

const toRender = prepare(template, state)
const routes = {
  '/toggle/index.html': toRender,
  '/hello': null
}

ready(function () {
  attach(document.body, routes)
})
