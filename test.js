const test = require('tape')
const { attach, prepare, ready, render } = require('./lib/index')

test('render simple template', t => {
  t.plan(2)
  function template () {
    t.ok(arguments.length, 1, 'appstate was passed to root renderer')
    return render`<body><p>Hello</p></body>`
  }
  attach('body', prepare(template))
  ready(() => {
    t.ok(document.querySelector('p').innerHTML.includes('Hello'))
    t.end()
  })
})

test('render simple template with state', t => {
  t.plan(2)
  const state = { initial: 'test', test: { value: 'Hello' }}
  function template ({ value }) {
    t.ok(arguments.length, 2, 'model and appstate was passed to root renderer')
    return render`<body><p>${value}</p></body>`
  }
  attach('body', prepare(template, state))
  ready(function () {
    t.equal(document.querySelector('p').innerHTML, state.test.value)
    t.end()
  })
})