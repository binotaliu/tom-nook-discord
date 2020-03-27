const cron = require('node-cron')

const daysCounter = require('./days-counter')
const rolesConfirmation = require('./roles-confirmation')
const tickPresent = require('./tick-present')
const turnipsReminder = require('./turnips-reminder')

const jobs = [
  daysCounter,
  rolesConfirmation,
  tickPresent,
  turnipsReminder
]

module.exports = class ScheduledJobs {
  constructor(client, config, dataBag) {
    this.client = client
    this.config = config
    this.dataBag = dataBag
    this.jobs = []

    const addJob = (time, handler) => cron.schedule(time, handler, { timezone: 'Asia/Taipei' })

    jobs
      .forEach(job => this.jobs.push(...job({ client, config, dataBag, addJob })))
  }
}

