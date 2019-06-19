const onchange = require('on-change')

function proxyConstructor (obj, callback) {
  return new Proxy(obj, {
    construct (target, ...args) {
      return Reflect.construct(
        function () {
          function newTarget () { }
          newTarget.prototype =
            onchange(Object.create(target.prototype), callback)
          const instance =
            Reflect.construct(target.prototype.constructor, [], newTarget)
          return onchange(instance, callback)
        },
        ...args
      )
    }
  })
}

module.exports = function create (state, callback) {
  let State = state
  if (typeof State !== 'function') State = (() => state)()

  if (State.prototype) {
    const Proxied = proxyConstructor(State, callback)
    return new Proxied()
  } else {
    return onchange(State, callback)
  }
}
