const { merge, prepare, render } = elementree

class ClockState {
  constructor () {
    this.onTick()
    setInterval(this.onTick.bind(this), 1000)
  }

  onTick () {
    const now = new Date()
    this.hours = now.getHours()
    this.minutes = now.getMinutes()
    this.seconds = now.getSeconds()
  }
}

function clock (state) {
  return render`
    <body>
      <strong>${state.hours} : ${state.minutes} : ${state.seconds}</strong>
    </body>
  `
}

merge('body', prepare(clock, ClockState))
