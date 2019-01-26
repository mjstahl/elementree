const { Stated } = require('@mjstahl/stated')

let appState, matches = {}
function createMatch (route) {
  const vx = '(:\\w+)'
  const address = new RegExp(vx, 'g')
  const vars = (route.match(address) || []).map((v) => v.slice(1))
  matches[route.replace(address, vx)] = { route, vars }
}

function match (pathname) {
  // should probably return the whole object here
  // that way we get the route, and we get the vars
  // in case there is state we have to update
  return Object.keys(matches).find(addr => {
    return new RegExp(addr, 'g').test(pathname)
  })
}

function register (routes, state = {}) {
  Object.keys(routes).forEach(route => {
    routes[route] = { view: routes[route], value: state }
    createMatch(route)
  })
  appState = new Stated(routes)
  appState.initial = match(window.location.pathname) || '*'
  return appState
}

function route (address, value) {
  const route = match(address)
  if (window.location.pathname !== route) {
    window.history.pushState({}, null, route)
  }
  // once we find the correct route, we need to match
  // it and relate the matched values to the variables
  // that are held by <match>.vars
  try {
    appState.to(route, Object.assign(appState.value, value))
  } catch (e) {
    console.error(`"${address}" does not match a configured route.`)
  }
}

function view (routes) {
  return routes.__states[routes.state].view
}

module.exports = { register, route, view }