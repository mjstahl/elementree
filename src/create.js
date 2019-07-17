const onchange = require('on-change')

function proxyConstructor (obj, callback) {
  let proxied = null

  function constructor () {
    function Proxied () { }
    Proxied.prototype =
      onchange(Object.create(obj.prototype), callback)
    proxied = Proxied.prototype
    const instance =
      Reflect.construct(obj.prototype.constructor, [], Proxied)
    return onchange(instance, callback)
  }

  Reflect.construct(constructor, [])
  return proxied
}

module.exports = function create (state, callback) {
  let State = state
  if (typeof State !== 'function') State = (() => state)()

  if (State.prototype) {
    return proxyConstructor(State, callback)
  } else {
    return onchange(State, callback)
  }
}
