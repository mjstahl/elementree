const test = require('tape')
const { attach, forceUpdate, prepare, ready, render } = require('../index')

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

test('passing arguments to child', t => {
  t.plan(3)
  function child (fromParent) {
    t.ok(arguments.length, 1, 'child does not include state')
    return render`<p id="child">${fromParent}</p>`
  }
  function parent () {
    return render`
      <body>
        <p id="parent">Hello</p>
        ${child('World')}
      </body>
    `
  }
  attach('body', prepare(parent))
  ready(() => {
    t.equal(document.querySelector('#parent').innerHTML, 'Hello')
    t.equal(document.querySelector('#child').innerHTML, 'World')
    t.end()
  })
})

test('render simple template with state', t => {
  t.plan(2)
  const state = { initial: 'test', test: { value: 'Hello' } }
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

test('passing args to child with state', t => {
  const childState = { initial: 'test', test: { value: 'World' } }
  function childTemplate ({ value }, parent) {
    t.ok(arguments.length, 2, 'child model and parent arguments passed to child')
    return render`
      <p id="child">${parent} ${value}</p>
    `
  }
  const child = prepare(childTemplate, childState)

  const parentState = { initial: 'test', test: { value: 'Hello' } }
  function parentTemplate ({ value }) {
    return render`
      <body>
        <p id="parent">${value}</p>
        ${child('Brave New')}
      </body>
    `
  }
  attach('body', prepare(parentTemplate, parentState))
  ready(function () {
    t.equal(document.querySelector('#parent').innerHTML, 'Hello')
    t.equal(document.querySelector('#child').innerHTML, 'Brave New World')
    t.end()
  })
})

test('re-render on state change', t => {
  t.plan(3)
  function template (model, app) {
    t.ok(app, 'appstate is defined')
    return render`
      <body>
        <p>${model.value} ${app.user.first} ${app.user.last}</p>
        <button onclick=${toggle}>
          Toggle
        </button>
      </body>
    `
    function toggle () {
      model.transition.toggle()
    }
  }
  const state = {
    initial: 'hello',
    hello: {
      value: 'Hello',
      toggle: 'goodbye'
    },
    goodbye: {
      value: 'Goodbye',
      toggle: 'hello'
    }
  }
  const app = {
    user: { first: 'Mark', last: 'Stahl' }
  }
  attach('body', prepare(template, state), app)
  ready(function () {
    document.querySelector('button').click()
    const result = `${state.goodbye.value} ${app.user.first} ${app.user.last}`
    t.equal(document.querySelector('p').innerHTML, result)
    t.end()
  })
})

test('change appstate and forceUpdate', t => {
  function template (app) {
    t.ok(app.user, 'appstate user is defined')
    return render`
      <body>
        <p>${app.user.first} ${app.user.last}</p>
        <button onclick=${toggle}>
          Toggle
        </button>
      </body>
    `
    function toggle () {
      app.user.first = 'Terri'
      forceUpdate()
    }
  }
  const app = {
    user: { first: 'Mark', last: 'Stahl' }
  }
  attach('body', prepare(template), app)
  ready(function () {
    document.querySelector('button').click()
    const result = `Terri ${app.user.last}`
    t.equal(document.querySelector('p').innerHTML, result)
    t.end()
  })
})
