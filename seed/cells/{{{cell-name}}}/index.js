const DNA = window.DNA
const Cell = require('organic-stem-cell')

require('./index.css')
require('oval-welcome-message')

let cellInstance = new Cell({
  dna: DNA,
  buildBranch: 'build',
  defaultKillChemical: 'kill'
})
cellInstance.start()
