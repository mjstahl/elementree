const { Stated } = require('@mjstahl/stated')

module.exports = function (routes) {
  Object.keys(routes).forEach(r => {
    const option = routes[r]
    const value = (typeof option === 'function') ? { view: option } : option
    routes[r] = { value }
    if (!routes.initial) {
      routes.initial =
        (new RegExp(r).test(window.location.pathname)) ? r : undefined
    }
  })
  return new Stated(routes)
}