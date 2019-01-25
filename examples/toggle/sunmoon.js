const { prepare, render } = require('../../index')

function template (model, greeting) {
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
module.exports = prepare(template, state)

