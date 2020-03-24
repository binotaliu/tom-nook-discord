const cron = require('node-cron')

const daysCounter = require('./days-counter')
const nicknamesMaintenance = require('./nicknames-maintenance')
const rolesConfirmation = require('./roles-confirmation')
const tickPresent = require('./tick-present')
const turnipsReminder = require('./turnips-reminder')

const jobs = [
  daysCounter,
  nicknamesMaintenance,
  rolesConfirmation,
  tickPresent,
  turnipsReminder
]

module.exports = class ScheduledJobs {
  constructor(client, config, dataBag) {
    this.client = client
    this.config = config
    this.dataBag = dataBag

    const addJob = (time, handler) => cron.schedule(time, handler, { timezone: 'Asia/Taipei' })

    this.jobs = jobs.map((job) => job({ client, config, dataBag, addJob }))
  }
}

