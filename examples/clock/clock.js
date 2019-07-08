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
  const { hours, minutes, seconds } = state
  const rendered = render`
    <body>
      <strong>${hours} : ${minutes} : ${seconds}</strong>
    </body>
  `
  return rendered
}

merge('body', prepare(clock, ClockState))
