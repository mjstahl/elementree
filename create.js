const onchange = require('on-change')

module.exports = function create (model, callback) {
  let Model = model
  if (typeof Model !== 'function') Model = function () { return model }

  const instance = (Model.prototype) ? new Model() : Model()
  return onchange(instance, callback)
}
