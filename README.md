![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  [![Build Status](https://travis-ci.com/mjstahl/elementree.svg?branch=master)](https://travis-ci.com/mjstahl/elementree)

# Elementree
> "Make the simple things easy and the hard things possible."

Elementree is a very extremely small front-end JavaScript "framework" with a focus
on staying "Just JavaScript" and getting the job done with the mimimum amount of
framework-y concepts.

## Features

* Tiny size. Elementree is less than 4 KB when compressed.
* Minimal cognitive overhead. Less framework means more time to focus on the problem domain.
* It's just JavaScript. Nothing fancy. Just functions, objects, and template strings.

## Philosophy

The APIs introduced in Elementree and used during development are deliberately kept small in number and complexity. This fosters focus on the problem domain and process, as opposed to the glory of the framework.

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
  render,       // render JS template strings as HTML
} from 'elementree'
```

## Example

```js
import { attach, prepare, render } from 'elementree'

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
const state = {
  greeting: 'Hello'
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
html`unescaped: String` -> String
```

Use `html` to interpolate HTML, without escaping it, directly into your template.


```js
prepare(template: Function [, model: Object]) -> Function
```

Create a renderer function. At a minimum, a template function is required to be passed as the first argument. The second argument, which is optional, is an object
that acts as a localized model to the template.

If the template function is prepared with a model, the model **will ALWAYS be the first argument to the template function**. All other arguments will follow.


```js
render`template: String` -> HTMLElement | DocumentFragment
```

A tagged template function. Turn a JavaScript template string into an `HTMLElement`. If the template has more than one root element a `DocumentFragment` is returned.