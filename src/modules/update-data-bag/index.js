module.exports = ({ app, addJob }) => [
  addJob('0 0 * * * *', () => app.dataBag.updateAll())
]
