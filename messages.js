function wrongParent (expected, actual) {
  const message = `You are probably looking at a blank page right now.
    Elementree is looking for "${expected}" as the parent tag and found "${actual}" instead.
    Surround your top-most view template with a "${expected}" tag, or change the 0th argument of 'merge'.`
  console.warn(message)
}

module.exports = {
  wrongParent
}
