const { Stated } = require('@mjstahl/stated')

let appState; let matches = {}
function createMatch (route) {
  const varRegExp = new RegExp('(:\\w+)', 'g')
  const vars = (route.match(varRegExp) || []).map((v) => v.slice(1))
  const regex = route.replace(varRegExp, '(\\w+)')
  matches[regex] = { regex, route, vars }
}

function match (pathname) {
  const matched = Object.keys(matches).find(addr => {
    addr = (addr === '*') ? '\\*' : addr
    return new RegExp(addr, 'g').test(pathname)
  })
  return matches[matched]
}

function register (routes, state = {}) {
  Object.keys(routes).forEach(route => {
    routes[route] = { view: routes[route], value: state }
    createMatch(route)
  })
  appState = new Stated(routes)
  const matched = match(window.location.pathname)
  appState.initial = (matched && matched.route) || '*'
  return appState
}

function route (address, value = {}) {
  const matched = match(address)
  if (window.location.pathname !== matched) {
    window.history.pushState({}, null, address)
  }
  if (matched) {
    const values = address.match(matched.regex).slice(1)
    const routeValues = matched.vars.reduce((vals, prop, i) => {
      return Object.assign(vals, { [prop]: values[i] })
    }, {})
    value = Object.assign(value, routeValues)
  }
  try {
    const routeTo = (matched && matched.route) || '*'
    appState.to(routeTo, Object.assign(appState.value, value))
  } catch (e) {
    console.error(`"${address}" does not match a configured route.`)
  }
}

function view (routes) {
  return routes.__states[routes.state].view
}

window.onpopstate = (function (route) {
  return () => route(window.location.pathname)
})(route)

module.exports = { register, route, view }
