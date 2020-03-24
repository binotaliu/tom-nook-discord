module.exports = ({ dataBag, addJob }) => [
  addJob('0,30 * * * * *', () => dataBag.updateAll())
]

