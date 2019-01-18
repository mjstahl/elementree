# Elementree
"Make everything as simple as possible, but not simpler."

We think that might look something like **Finite State Machines + JS Template Literals**.
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
  const { actions, inital, to, value } = stated

  return html`
    <p>${value}</p>
    <button onclick=${signoff}>World</button>
    <button onclick=${reset}>Reset</button>
  `

  function reset () {
    initial()
  }

  function signoff () {
    to(actions.GOODBYE)
  }
}

const children = elementree(state, template)
document.body.appendChild(children)
```