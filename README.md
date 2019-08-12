![stability-experimental](https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)  [![Build Status](https://img.shields.io/travis/elementreejs/elementree/master.svg?style=flat-square)](https://travis-ci.com/elementreejs/elementree.svg?branch=master)

# Elementree
> "Celebrate the code of the problem domain as opposed to the framework."

Elementree is an extremely small front-end JavaScript "framework" with a focus
on getting the job done with the mimimum amount of framework-y concepts.

## Example

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module">
      import { merge, prepare, render } from 'https://unpkg.com/elementree'

      function Hello (state) {
        if (!state.email) state.requestUser()
        return render`
          <body>
            <p>Hello! ${state.email}</p>
            <button onclick=${() => state.nextEmail()}>Next Email</button>
          </body>
        `
      }

      const HelloState = {
        id: 1,
        email: '',
        nextEmail: function () {
          this.email = null
          this.id += 1
        },
        requestUser: async function () {
          const response = await fetch(`https://reqres.in/api/users/${this.id}`)
          const { data } = await response.json()
          this.email = data.email
        }
      }

      merge('body', prepare(Hello, HelloState))
    </script>
  </body>
</html>
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
prepare(template: Function [, state: Object]) -> (Function -> HTMLElement)
```

`prepare` a template function with a state object, creating a view function. At a minimum, a template function is required to be passed as the first argument. The second argument, which is optional, is an object representing the local view state. If the template function is joined with a state, the state object **will ALWAYS be the 0th argument to the view function**. All parent arguments will follow.


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