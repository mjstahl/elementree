![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  [![Build Status](https://travis-ci.com/mjstahl/elementree.svg?branch=master)](https://travis-ci.com/mjstahl/elementree)

# Elementree
> "Make everything as simple as possible, but not simpler."

Elementree is a very small front-end JavaScript "framework" created to experiment
with the use of Finite State Machines for state management.

## Features

* Tiny size. Elementree is less than 6 KB when compressed.
* Minimal cognitive overhead. Less framework means more time to focus on the problem domain.
* Process-focused. The use of Finite State Machines for state provides the right level of constraint.
* It's just JavaScript. Nothing fancy, just functions, objects, and template strings.

## Philosophy

The jury is still out on how we handle application and component state and how they relate to each other. Elementree focuses on using Finite state machines (FSM) to manage application and component state. FSM's are a natural translation of a designer's mockups into a developer's implementation.

For some, FSMs seem natural from a process perspective, while for others, they are alien in concept. Therefore, the APIs introduced in Elementree and used during development are deliberately kept small in number and complexity. This fosters focus on the problem domain and process, as opposed to the glory of the framework.

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

## API

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
