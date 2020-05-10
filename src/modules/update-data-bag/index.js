module.exports = ({ app, addJob }) => [
  addJob('0,30 * * * * *', () => app.dataBag.updateAll())
]
