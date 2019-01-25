# Elementree
"Make everything as simple as possible, but not simpler."

We think that might look something like **Pushdown Automata + JS Template Literals**.
At least for web development.

## A Simple Example

```js
const { attach, prepare, ready, render } = require('@mjstahl/elementree')

function template (model, app) {
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
    model.reset()
  }

  function signoff () {
    model.to(model.actions.GOODBYE)
  }
}

const state = {
  initial: 'hello',
  hello: {
    value: 'Hello',
    GOODBYE: 'goodbye'
  },
  goodbye: {
    value: 'Goodbye'
  }
}

prepare(template, state)
ready(function () {
  attach(document.body)
})
```