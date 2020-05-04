module.exports = ({ addJob }) => [
  addJob('0,30 * * * * *', () => app.dataBag.updateAll())
]
