const DNA = window.DNA
const Cell = require('organic-stem-cell')

require('./index.css')

let cellInstance = new Cell({
  dna: DNA,
  buildBranch: 'build',
  defaultKillChemical: 'kill'
})
window.plasma = cellInstance.plasma
window.plasma.on('domready', () => {
  require('./ui/oval-welcome-message')
  require('lib/client/common-header')
})
cellInstance.start()
