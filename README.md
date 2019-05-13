![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  [![Build Status](https://travis-ci.com/mjstahl/elementree.svg?branch=master)](https://travis-ci.com/mjstahl/elementree)

# Elementree
> "Make everything as simple as possible, but no simpler."

Elementree is a very small front-end JavaScript "framework" created to experiment
with the use of Finite State Machines for state management.

## Features

* Tiny size. Elementree is less than 8 KB when compressed.
* Minimal cognitive overhead. Less framework means more time to focus on the problem domain.
* Process-focused. The use of Finite State Machines for state provides the right level of constraint.
* It's just JavaScript. Nothing fancy, just functions, objects, and template strings.

## Philosophy

Elementree focuses on using Finite state machines (FSM) to manage application and component state. FSM's are a natural translation of a designer's mockups into a developer's implementation. The APIs introduced in Elementree and used during development are deliberately kept small in number and complexity. This fosters focus on the problem domain and process, as opposed to the glory of the framework.

## Installation

```sh
$ npm install --save elementree
```

```js
import elementree from 'elementree'

import {
  attach,       // mount a view and app state to a selector
  html,         // don't escape HTML
  prepare,      // setup the rendering of a template with its state
  ready,        // DOM is setup and ready to render on
  render,       // render JS template strings as HTML
  route,        // change the route
} from 'elementree'
```

## Example

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
    model.transition.toggle()
  }
}

// state local to the template above
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

// application state
const app = {
  user: { first: 'Mark', last: 'Stahl' }
}

attach('body', prepare(template, state), app)
```

## Elementree API

```js
attach(to: String | HTMLElement, renderer: Function | Object [, state: Object])
```

`attach` wires up a renderer and an optional object representing an application
state and attaches it to a selector or DOM element. Simply put, `attach` renders
your root template to the DOM.

The first argument to `attach` can be a string which will be used by
`document.querySelector`, after `DOMContentLoaded`, is  to find root element. The
first argument can also be an `HTMLElement`. If so, it should be used within
the `ready` callback to ensure the element exists.

The second argument is the renderer. This argument can be a `Function` such as
one returned a `prepared` call, or an object. Passing a function is usually done
when routing is not used and there is one root template. Elementree expects
the object passed to have a specific form which is covered in "routing" section.

The third, optional, argument is an object representing the application's state.
This object will passed to the renderer as an argument.


```js
html(unescape: String) -> String
```

Use `html` to interpolate HTML, without escaping it, directly into your template.


```js
prepare(template: Function [, model: Object | Stated]) -> Function
```

Create a renderer function. At a minimum, a template function is required to be passed as the first argument. The second argument, which is optional, is a Stated object or
an object that Stated can accept.

The arguments to a template greater depend on rule:

If the template function is prepared with a model, the model **will ALWAYS be the first argument to the template function**. All other arguments will follow.


```js
ready(callback: Function)
```

Execute the callback function once the DOM has loaded. If the DOM is already loaded, the callback will be called on the next tick.


```js
render(template: String) -> HTMLElement | DocumentFragment
```

A tagged template function. Turn a JavaScript template string into an `HTMLElement`. If the template has more than one root element a `DocumentFragment` is returned.


```js
route(to: String [, state: Object])
```

Change the route to string provided. The optional second argument will be merged with
current application state.

## State API

A valid state machine object must have, at a minimum, a single state. And an `initial` property which is set to a valid state property.

There are two types of state machine definitions: "active" and passive. If the definition includes names for each valid transition it is an "active" definition and the `transition` property will include "active" functions (like `freeze()` and `boil()`). An example of an "active" definition is:

```js
{
  initial: 'liquid',
  liquid: {
    freeze: 'solid',
    boil: 'gas',
    value: '60F'
  },
  solid: {
    melt: 'liquid',
    value: '32F'
  },
  gas: {
    chill: 'liquid'
    value: '212F'
  }
}
```

A "passive" definition uses the `to` property on each state indicating one or more valid states the current state can transition to. For a "passive" definition, the `transition` property will only include "passive" functions (like `toSolid` and `toGas`). An example of an "passive" definition is:

```js
{
  initial: 'liquid',
  liquid: {
    to: ['solid', 'gas']
    value: '60F'
  },
  solid: {
    to: 'liquid'
    value: '32F'
  },
  gas: {
    to: 'liquid'
    value: '212F'
  }
}
```


```js
.state -> String
```

Return the name of the current state of the state machine.


```js
.value -> Any
```

`value` returns the value (object or primitive) of the current state if one exists and returns `undefined` if not.


```js
.transition -> Object
```

`transition` is an object with a collection of functions allowing the developer to avoid
transitioning using the string names. In the example above, when in the `liquid` state, two passive and two active functions exist on `transition`. The passive functions are `transition.toSolid`, `transition.toGas`. The two active functions are `transition.freeze` and `transition.boil`. All state specific functions on `transition` accept a single `value` argument.

If the value argument is an Object, the state's `value` and value argument will be merged. If the the state's `value` is not an Object, the state's `value` will be replaced with the value argument. If the state's `value` is a primitive and the value argument is an object, the state's `value` will be set to the value argument including a property named `value` set to the state's previous primitive value.

```js
<StateMachine>.onTransition(callback: Function) -> unsubscribe: Function
```

When a state machine transitions from one state to another all callbacks passed to the `onTransition` function are evaluated with the state machine object passed as the only argument to the callback. `onTransition` returns a function that unsubscribes the callback when executed.
