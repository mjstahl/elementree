# Elementree
"Make everything as simple as possible, but not simpler."

We think that might look something like **Pushdown Automata + JS Template Literals**.
At least for web development.

## A Simple Toggle Example

```js
const { attach, prepare, render } = require('@mjstahl/elementree')

function template (model, app) {
  return render`
    <body>
      <p>${model.value}</p>
      <button onclick=${toggle}>
        Toggle
      </button>
    </body>
  `

  function toggle () {
    model.to(model.actions.TOGGLE)
  }
}

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

prepare(template, state)
attach('body')
```