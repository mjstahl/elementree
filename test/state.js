const StateMachine = require('../state')
const test = require('tape')

function H2O () {
  return {
    initial: 'liquid',
    liquid: {
      to: 'solid',
      value: '60F'
    },
    solid: {
      to: ['gas', 'liquid'],
      value: '32F'
    },
    gas: {
      to: 'liquid',
      value: {
        temp: '212F',
        knownAs: 'steam'
      }
    }
  }
}

test('newly created instance', t => {
  t.plan(3)
  const state = new StateMachine(H2O())
  t.equal(state.state, 'liquid')
  t.equal(state.value, '60F')
  t.ok(Object.keys(state.transition).includes('toSolid'))
  t.end()
})

test('states must specify a valid initial state', t => {
  let states = {
    liquid: {}
  }
  t.throws(() => new StateMachine(states))
  states = {
    initial: 'solid',
    liquid: {}
  }
  t.throws(() => new StateMachine(states))
  t.end()
})

test('transition to a new state', t => {
  const state = new StateMachine(H2O())
  state.transition.toSolid()
  t.equals(state.state, 'solid')
  t.equals(state.value, '32F')
  t.ok(Object.keys(state.transition).includes('toLiquid', 'toGas'))
  t.end()
})

test('transition is also an object with state functions', t => {
  const state = new StateMachine(H2O())
  state.transition.toSolid()
  t.equals(state.state, 'solid')
  t.equals(state.value, '32F')

  state.transition.toLiquid('65F')
  t.equal(state.state, 'liquid')
  t.equal(state.value, '65F')
  t.end()
})

test('update primitive value with a primitive', t => {
  const state = new StateMachine(H2O())
  state.transition.toSolid('30F')
  t.equal(state.value, '30F')
  t.end()
})

test('update primitive value with an object', t => {
  const state = new StateMachine(H2O())
  state.transition.toSolid({ knownAs: 'ice' })
  t.equal(state.value.knownAs, 'ice')
  t.equal(state.value.value, '32F')
  t.end()
})

test('update object value with an object', t => {
  const state = new StateMachine(H2O())
  state.transition.toSolid()
  state.transition.toGas({ temp: '213F' })
  t.equal(state.value.knownAs, 'steam')
  t.equal(state.value.temp, '213F')
  t.end()
})

test('states without to states can transition to all states', t => {
  const state = new StateMachine({
    initial: 'liquid',
    liquid: {
      freeze: 'solid',
      boil: 'gas',
      value: '60F'
    },
    solid: {
      warm: 'liquid',
      value: '32F'
    },
    gas: {
      chill: 'liquid',
      value: '212F'
    }
  })
  t.ok(Object.keys(state.transition).includes('toSolid', 'toGas', 'freeze', 'boild'))

  state.transition.toGas()
  t.ok(Object.keys(state.transition).includes('toLiquid', 'chill'))
  t.equal(state.state, 'gas')
  t.end()
})
