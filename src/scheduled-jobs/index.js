const cron = require('node-cron')

const daysCounter = require('./days-counter')
const nicknamesMaintenance = require('./nicknames-maintenance')
const rolesConfirmation = require('./roles-confirmation')
const tickPresent = require('./tick-present')

const jobs = [
  daysCounter,
  nicknamesMaintenance,
  rolesConfirmation,
  tickPresent
]

module.exports = class ScheduledJobs {
  constructor(client, config, dataBag) {
    this.client = client
    this.config = config
    this.dataBag = dataBag

    this.jobs = jobs.map((job) => job({ client, config, dataBag, addJob: (time, handler) => cron.schedule(time, handler) }))
  }
}

