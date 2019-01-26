const { Stated } = require('@mjstahl/stated')

let appState
function register (routes, state = {}) {
  Object.keys(routes).forEach(r => {
    routes[r] = { view: routes[r], value: state }
    routes.initial = (routes.initial)
      ? routes.initial
      : (new RegExp(r).test(window.location.pathname)) ? r : undefined
  })
  appState = new Stated(routes)
  return appState
}

function route (address, value) {
  appState.to(address, Object.assign(appState.value, value))
}

function view (routes) {
  return routes.__states[routes.state].view
}

module.exports = { register, route, view }