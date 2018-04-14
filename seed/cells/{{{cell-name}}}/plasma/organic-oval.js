/* global oval */
module.exports = function (plasma, dna) {
  oval.init(plasma)

  require('domready')(function () {
    oval.mountAll(document.body)
  })
}
