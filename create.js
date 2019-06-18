const onchange = require('on-change')

function proxyConstructor (obj, callback) {
  return new Proxy(obj, {
    construct (target, ...args) {
      return Reflect.construct(
        function createTarget () {
          const proto = Object.create(target.prototype)
          const protoProxy = onchange(proto, callback)
          try {
            const instance = target.prototype.constructor.call(protoProxy)
            return onchange(instance, callback)
          } catch (e) { }
          return protoProxy
        },
        ...args
      )
    }
  })
}

module.exports = function create (model, callback) {
  let Model = model
  if (typeof Model !== 'function') Model = (() => model)()

  if (Model.prototype) {
    const Proxied = proxyConstructor(Model, callback)
    return new Proxied()
  } else {
    return onchange(Model, callback)
  }
}
