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

function template ({ actions, inital, to, value }) {
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

const tree = elementree(template)(state)
document.body.appendChild(tree)
```