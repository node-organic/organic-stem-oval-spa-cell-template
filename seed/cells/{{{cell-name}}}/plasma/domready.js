module.exports = function (plasma, dna) {
  require('domready')(function () {
    plasma.emit(dna.emitReady)
  })
}
