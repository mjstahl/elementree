# Elementree
"Make everything as simple as possible, but not simpler."

We think that might look something like **Pushdown Automata + JS Template Literals**.
At least for web development.

## A Simple Example

```js
const { couple, render } = require('@mjstahl/elementree')

const state = {
  initial: {
    value: 'Hello',
    GOODBYE: 'goodbye'
  },
  goodbye: {
    value: 'Goodbye'
  }
}

function template (app, model) {
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
    model.initial()
  }

  function signoff () {
    model.to(model.actions.GOODBYE)
  }
}

couple(template, state)('body')
```