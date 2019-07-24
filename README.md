![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)  [![Build Status](https://img.shields.io/travis/elementreejs/elementree/master.svg?style=flat-square)](https://travis-ci.com/elementreejs/elementree.svg?branch=master)

# Elementree
> "Celebrate the code of the problem domain as opposed to the framework."

Elementree is a very extremely small front-end JavaScript "framework" with a focus
on getting the job done with the mimimum amount of framework-y concepts.

## Features

* Tiny size. Elementree is less than 6.1 KB with all dependencies and compressed.
* Minimal cognitive overhead. More time focused on the problem domain and less time thumbing through framework documentation.
* Nothing fancy. No transpiling, compiling, or proprietary data shapes. Just functions and template strings.

## Philosophy

The APIs introduced in Elementree and used during development are deliberately kept small in number and complexity. This fosters focus on the problem domain and process, as opposed to the glory of the framework.

## Installation (Bare ES Modules)

```html
<!-- in *.html -->
<script type="module">
  import { merge, prepare, html, render } from 'https://unpkg.com/elementree'
</script>
```

```js
// in *.js
import { merge, prepare, html, render } from 'https://unpkg.com/elementree'
```

## Example

```js
import { merge, prepare, render } from 'elementree'

function view (state, { user }) {
  return render`
    <body>
      <p>${state.greeting}, ${user.first} ${user.last}</p>
      <button onclick=${toggle}>
        Toggle
      </button>
    </body>
  `

  function toggle () {
    state.greeting = 'Goodbye'
  }
}

// state local to the template above
const state = { greeting: 'Hello' }

// application state
const app = {
  user: { first: 'Mark', last: 'Stahl' }
}

merge('body', prepare(view, state), app)
```

## Elementree API

```js
merge(to: String, view: Function [, state: Object]) -> undefined
```

`merge` wires up a view and an optional object representing the application
state and merges it to a selector. Simply put, `merge` renders your root view to the DOM.

The first argument to `merge` is a string which will be used by `document.querySelector`, after `DOMContentLoaded`, to find root element. The second argument is the top-level view. This argument is a `Function` that returns a function that returns an `HTMLElement` such as a `prepare` call. The third, optional, argument is an object representing the application's state. This object will passed to the renderer function as an parent argument (i.e. following the view's state if there is one).

Elementree adds a single property to the application's state object. The `route` property is a concatenation of `location.pathname`, `location.search` and `location.hash`. Updating the `route` property will cause a `history.pushState`. Updating the address through browser interations will update the `route` property.

If the `window` object does not exist the call to `merge` will return the `outerHTML` on the result of the rendering.


```js
prepare(view: Function [, state: Object]) -> (Function -> HTMLElement)
```

`prepare` a template with a state object, creating a view function. At a minimum, a view function is required to be passed as the first argument. The second argument, which is optional, is an object representing the local view state. If the view function is joined with a state, the state object **will ALWAYS be the 0th argument to the view function**. All parent arguments will follow.


```js
render`template: String` -> HTMLElement
```

A tagged template function. Turn a JavaScript template string into an `HTMLElement`. If the template has more than one root element a `DocumentFragment` is returned.


```js
html`unescaped: String` -> HTMLElement
```

Use `html` to interpolate HTML, without escaping it, directly into your template.

## Attribution

This project would suck a whole lot more without the input from my awesome co-workers at [Bitovi](https://bitovi.com), the inspiration from [@choojs](https://github.com/choojs), and the amazing packages from [@sindresorhus](https://github.com/sindresorhus). Thank you.