const test = require('tape')
const { merge, prepare, render } = require('./src/elementree')
const ready = require('./src/ready')

test('render simple view', t => {
  function view (app) {
    t.equal(arguments.length, 1, 'app state was passed to root renderer')
    t.ok(app.route, 'app state has route property')
    return render`<body><p>Hello</p></body>`
  }
  merge('body', prepare(view))
  ready(() => {
    t.ok(document.querySelector('p').innerHTML.includes('Hello'),
      'view rendered')
    t.end()
  })
})

test('passing arguments to child', t => {
  function child (fromParent) {
    t.equal(arguments.length, 1, 'child only includes args passed from parent')
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
  merge('body', prepare(parent))
  ready(() => {
    t.equal(document.querySelector('#parent').innerHTML,
      'Hello', 'parent view rendered')
    t.equal(document.querySelector('#child').innerHTML,
      'World', 'child value substituted')
    t.end()
  })
})

test('render simple view with state', t => {
  const state = { value: 'Hello' }
  function view ({ value }) {
    t.ok(arguments.length, 'view state and app state was passed to root renderer')
    return render`<body><p>${value}</p></body>`
  }
  merge('body', prepare(view, state))
  ready(function () {
    t.equal(document.querySelector('p').innerHTML,
      'Hello', 'view state value substituted')
    t.end()
  })
})

test('passing args to child with state', t => {
  const childState = { value: 'World' }
  function childView ({ value }, parent) {
    t.ok(arguments.length, 2, 'child state and parent arguments passed to child')
    return render`
      <p id="child">${parent} ${value}</p>
    `
  }
  const child = prepare(childView, childState)

  const parentState = { value: 'Hello' }
  function parentView ({ value }) {
    return render`
      <body>
        <p id="parent">${value}</p>
        ${child('Brave New')}
      </body>
    `
  }
  merge('body', prepare(parentView, parentState))
  ready(function () {
    t.equal(document.querySelector('#parent').innerHTML,
      'Hello', 'parent value rendered')
    t.equal(document.querySelector('#child').innerHTML,
      'Brave New World', 'child state and parent arguments rendered')
    t.end()
  })
})

test('re-render on state change', t => {
  t.plan(3)
  function view (state, app) {
    t.ok(app, 'appstate is defined')
    return render`
      <body>
        <p>${state.value} ${app.user.first} ${app.user.last}</p>
        <button onclick=${toggle}>
          Toggle
        </button>
      </body>
    `
    function toggle () {
      state.value = 'Goodbye'
    }
  }
  const state = { value: 'Hello' }
  const app = {
    user: { first: 'Mark', last: 'Stahl' }
  }
  merge('body', prepare(view, state), app)
  ready(function () {
    document.querySelector('button').click()
    const result = `Goodbye Mark Stahl`
    t.equal(document.querySelector('p').innerHTML, result, 'view re-rendered')
    t.end()
  })
})

test('views have different state instances', t => {
  const childState = { value: 'sun' }
  function childView (state, parent) {
    state.value = (parent === 'goodnight') ? 'moon' : state.value
    return render`
      <p class="child-${parent}">${parent} ${state.value}</p>
    `
  }
  const child = prepare(childView, childState)

  function parentView () {
    return render`
      <body>
        <p class="child1">${child('hello')}</p>
        <p class="child2">${child('goodnight')}</p>
      </body>
    `
  }
  merge('body', prepare(parentView))
  ready(function () {
    t.equal(document.querySelector('.child-hello').innerHTML,
      'hello sun', 'first instance rendered correctly')
    t.equal(document.querySelector('.child-goodnight').innerHTML,
      'goodnight moon', 'second instance rendered correctly')
    t.end()
  })
})

test('render simple view with constructor function', t => {
  t.plan(1)
  function State () { this.value = 'Hello' }
  function view ({ value }) {
    return render`<body><p>${value}</p></body>`
  }
  merge('body', prepare(view, State))
  ready(function () {
    t.equal(document.querySelector('p').innerHTML,
      'Hello', 'view state as constructor rendered correctly')
    t.end()
  })
})

test('render simple view with constructor function as app state', t => {
  t.plan(1)
  function State () { this.value = 'Hello' }
  function view ({ value }) {
    return render`<body><p>${value}</p></body>`
  }
  merge('body', prepare(view), State)
  ready(function () {
    t.equal(document.querySelector('p').innerHTML,
      'Hello', 'app state as constructor rendered correctly')
    t.end()
  })
})

test('render simple view with state class', t => {
  t.plan(1)
  class State {
    constructor () { this.value = 'Hello' }
  }
  function view ({ value }) {
    return render`<body><p>${value}</p></body>`
  }
  merge('body', prepare(view, State))
  ready(function () {
    t.equal(document.querySelector('p').innerHTML,
      'Hello', 'view state as class rendered correctly')
    t.end()
  })
})

test('render simple view with state class as app state', t => {
  t.plan(1)
  class State {
    constructor () { this.value = 'Hello' }
  }
  function view ({ value }) {
    return render`<body><p>${value}</p></body>`
  }
  merge('body', prepare(view), State)
  ready(function () {
    t.equal(document.querySelector('p').innerHTML,
      'Hello', 'app state as class rendered correctly')
    t.end()
  })
})
