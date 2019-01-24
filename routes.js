const stated = require('@mjstahl/stated')

module.exports = function (routes) {
  Object.keys(routes).forEach(r => {
    const option = routes[r]
    routes[r] = {
      value: (typeof option === 'function') ? { view: option } : option
    }
    if (!routes.initial) {
      const current = window.location.pathname
      routes.initial = (new RegExp(r).test(current)) ? r : null
    }
  })
  return stated(routes)
}