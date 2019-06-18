const onchange = require('on-change')

function proxyConstructor (obj, callback) {
  return new Proxy(obj, {
    construct (target, ...args) {
      return Reflect.construct(
        function () {
          function newTarget () { }
          newTarget.prototype =
            onchange(Object.create(target.prototype), callback)
          try {
            const instance =
              Reflect.construct(target.prototype.constructor, [], newTarget)
            return onchange(instance, callback)
          } catch (e) { }
          return newTarget.prototype
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
