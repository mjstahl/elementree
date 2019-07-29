import test from 'ava'

import { html, merge, prepare, render } from '../lib/elementree'
import ready from '../lib/ready'

test.beforeEach(_ => {
  const parent = document.querySelector('body')
  while (parent.firstChild) {
    parent.firstChild.remove()
  }
})

test.cb('render simple view', t => {
  function view (app) {
    t.is(arguments.length, 1, 'app state was passed to root renderer')
    t.truthy(app.route, 'app state has route property')
    return render`<body><p>Hello</p></body>`
  }
  merge('body', prepare(view))
  ready(() => {
    t.true(document.querySelector('p').innerHTML.includes('Hello'),
      'view rendered')
    t.end()
  })
})

test.cb('render raw', t => {
  function view () {
    return render`<body>${html`<p>Hello World</p>`}</body>`
  }
  merge('body', prepare(view))
  ready(() => {
    t.true(document.querySelector('p').innerHTML.includes('Hello World'),
      'raw view rendered')
    t.end()
  })
})

test.cb('passing arguments to child', t => {
  function child (fromParent) {
    t.is(arguments.length, 1, 'child only includes args passed from parent')
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
    t.is(document.querySelector('#parent').innerHTML,
      'Hello', 'parent view rendered')
    t.is(document.querySelector('#child').innerHTML,
      'World', 'child value substituted')
    t.end()
  })
})

test.cb('render simple view with state', t => {
  const state = { value: 'Hello' }
  function view ({ value }) {
    t.truthy(arguments.length, 'view state and app state was passed to root renderer')
    return render`<body><p>${value}</p></body>`
  }
  merge('body', prepare(view, state))
  ready(function () {
    t.is(document.querySelector('p').innerHTML,
      'Hello', 'view state value substituted')
    t.end()
  })
})

test.cb('passing args to child with state', t => {
  const childState = { value: 'World' }
  function childView ({ value }, parent) {
    t.is(arguments.length, 2, 'child state and parent arguments passed to child')
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
    t.is(document.querySelector('#parent').innerHTML,
      'Hello', 'parent value rendered')
    t.is(document.querySelector('#child').innerHTML,
      'Brave New World', 'child state and parent arguments rendered')
    t.end()
  })
})

test.cb('re-render on state change', t => {
  function view (state, app) {
    t.truthy(app, 'appstate is defined')
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
    t.is(document.querySelector('p').innerHTML, result, 'view re-rendered')
    t.end()
  })
})

test.cb('views have different state instances', t => {
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
    t.is(document.querySelector('.child-hello').innerHTML,
      'hello sun', 'first instance rendered correctly')
    t.is(document.querySelector('.child-goodnight').innerHTML,
      'goodnight moon', 'second instance rendered correctly')
    t.end()
  })
})
