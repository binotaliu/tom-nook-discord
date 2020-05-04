const Discord = require('discord.js')

const CommandHandler = require('./command-handler')
const DataBag = require('./data-bag')
const EventListeners = require('./listeners/')
const Resolver = require('./resolver')
const ScheduledJobs = require('./scheduled-jobs/')

const loginAndReady = (app) =>
  new Promise(async (resolve) => {
    await app.client.login(`Bot ${app.config.token}`)

    app.client.on('ready', () => {
      console.log('Booted')
      app.client.user.setActivity('Booting...')

      resolve()
    })
  })

module.exports = class App {
    constructor (config) {
        this.config = config

        this.client = new Discord.Client()

        this.hooks = Object.assign({}, ...Object.entries((this.config.webhooks || {}))
          .map(([channel, { id, token }]) => ({ [channel]: new Discord.WebhookClient(id, token) })))

        this.dataBag = new DataBag

        this.resolver = new Resolver(this.client)
    }

    async boot() {
        await Promise.all([this.dataBag.updateAll(), loginAndReady(this)])

        this.commandHandler = new CommandHandler(this)
        this.scheduledJobs = new ScheduledJobs(this)
        this.eventLisenters = new EventListeners(this)

        this.client.on('message', (message) => {
          const text = `${message.content}`.trim()
          if (text.charAt(0) === this.config.prefix) {
            try {
              this.commandHandler.handle(message)
            } catch (e) {
              message.reply(`${e}`)
            }
          }
        })
    }
}
