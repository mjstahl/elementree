const { prepare, render } = require('../../lib/index')

function sunmoon (model, greeting) {
  if (greeting.toLowerCase() !== model.state) {
    model.to(model.actions.TOGGLE)
  }
  return render`
    <span>${model.value}</span>
  `
}

const state = {
  initial: 'hello',
  hello: {
    value: 'Sun',
    TOGGLE: 'goodbye'
  },
  goodbye: {
    value: 'Moon',
    TOGGLE: 'hello'
  }
}
module.exports = prepare(sunmoon, state)

