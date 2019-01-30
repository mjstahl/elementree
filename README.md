# Elementree
> "Make everything as simple as possible, but not simpler."

Elementree is a very small (< 6KB) front-end JS "framework" created to test
the use of Finite State Machines as a means of taking a design and directly
translating it into state management.

The concepts introduced and used during development are deliberately kept small
in number and complexity as to focus on the process of breaking down an
application as opposed to learning a framework.

## Installation

```sh
$ npm install --save elementree
```

```js
import elementree from 'elementree'

import { attach, html, prepare, ready, render, route, State } from 'elementree'
```

## A Simple Toggle Example

```js
import { attach, prepare, render } from 'elementree'

function template (model, app) {
  return render`
    <body>
      <p>${model.value}, ${app.user.first} ${app.user.last}</p>
      <button onclick=${toggle}>
        Toggle
      </button>
    </body>
  `

  function toggle () {
    model.to(model.actions.TOGGLE)
  }
}

// state local to the template above
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

// application state
const app = {
  user: { first: 'Mark', last: 'Stahl' }
}

attach('body', prepare(template, state), app)
```