![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  [![Build Status](https://travis-ci.com/mjstahl/elementree.svg?branch=master)](https://travis-ci.com/mjstahl/elementree)

# Elementree
> "Less framework, more work."

Elementree is a very extremely small front-end JavaScript "framework" with a focus
on staying "Just JavaScript" and getting the job done with the mimimum amount of
framework-y concepts.

## Features

* Tiny size. Elementree is less than 6 KB compressed.
* Minimal cognitive overhead. Less framework means more time to focus on the problem domain.
* It's just JavaScript. Nothing fancy. Just functions, objects, and template strings.

## Philosophy

The APIs introduced in Elementree and used during development are deliberately kept small in number and complexity. This fosters focus on the problem domain and process, as opposed to the glory of the framework.

## Installation

```sh
$ npm install --save elementree
```

```js
import {
  merge,   // mount a view and app state to a selector
  prepare, // setup the rendering of a template with its state
  html,    // don't escape HTML
  render,  // render JS template strings as HTML
} from 'elementree'
```

## Example

```js
import { merge, prepare, render } from 'elementree'

function template (model, { user }) {
  return render`
    <body>
      <p>${model.greeting}, ${user.first} ${user.last}</p>
      <button onclick=${toggle}>
        Toggle
      </button>
    </body>
  `

  function toggle () {
    model.greeting = 'Goodbye'
  }
}

// state local to the template above
const state = () => ({ greeting: 'Hello' })

// application state
const app = {
  user: { first: 'Mark', last: 'Stahl' }
}

merge('body', prepare(template, state), app)
```

## Elementree API

```js
merge(to: String, renderer: Function | Object [, state: Function | Object])
```

`merge` wires up a renderer and an optional object representing an application
state and merges it to a selector or DOM element. Simply put, `merge` renders
your root template to the DOM.

The first argument to `merge` is a string which will be used by `document.querySelector`, after `DOMContentLoaded`, to find root element. The second argument is the renderer. This argument is a `Function` that returns an `HTMLElement` or `DocumentFragment` such as a `prepare` call. The third, optional, argument is an object, constructor function or function that returns an object representing the application's state. This object will passed to the renderer following the renderer's model.

Elementree adds a single property onto the application state object. The `route` property is a concatenation of `window.location.pathname` and `window.location.search`. Updating the `route` property will cause a `history.pushState`. Updating the address via browser interations will update the `route` property.


```js
html`unescaped: String` -> HTMLElement | DocumentFragment
```

Use `html` to interpolate HTML, without escaping it, directly into your template.


```js
prepare(template: Function [, model: Function]) -> Function
```

`prepare` a template with a model object together, creating a renderer function. At a minimum, a template function is required to be passed as the first argument. The second argument, which is optional, is a constructor function or a function that returns an object that is the localized model to the template. If the template function is joined with a model, the model **will ALWAYS be the first argument to the template function**. All other arguments will follow.


```js
render`template: String` -> HTMLElement | DocumentFragment
```

A tagged template function. Turn a JavaScript template string into an `HTMLElement`. If the template has more than one root element a `DocumentFragment` is returned.
