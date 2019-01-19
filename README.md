# Elementree
"Make everything as simple as possible, but not simpler."

We think that might look something like **Pushdown Automata + JS Template Literals**.
At least for web development.

## A Simple Example

```js
const { elementree, html, State } = require('@mjstahl/elementree')

const state = new State({
  initial: {
    value: 'Hello',
    GOODBYE: 'goodbye'
  },
  goodbye: {
    value: 'Goodbye'
  }
})

function template (stated) {
  return html`
    <body>
      <p>${stated.value}</p>
      <button onclick=${signoff} ${stated.state === 'goodbye' && 'disabled'}>
        World
      </button>
      <button onclick=${reset}>
        Reset
      </button>
    </body>
  `

  function reset () {
    stated.initial()
  }

  function signoff () {
    stated.to(stated.actions.GOODBYE)
  }
}

elementree(template, state)('body')
```