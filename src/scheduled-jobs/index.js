const cron = require('node-cron')

const daysCounter = require('./days-counter')
const rolesConfirmation = require('./roles-confirmation')
const tickPresent = require('./tick-present')
const turnipsReminder = require('./turnips-reminder')
const updateDataBag = require('./update-data-bag')

const jobs = [
  daysCounter,
  rolesConfirmation,
  tickPresent,
  turnipsReminder,
  updateDataBag
]

module.exports = class ScheduledJobs {
  constructor(app) {
    this.app = app
    this.jobs = []

    const addJob = (time, handler) => cron.schedule(time, handler, { timezone: 'Asia/Taipei' })

    jobs
      .forEach(job => this.jobs.push(...job({ app, addJob })))
  }
}
