const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config')
const DataBag = require('./src/data-bag')
const Resolver = require('./src/resolver')

const CommandHandler = require('./src/command-handler')
const ScheduledJobs = require('./src/scheduled-jobs/')
const EventListeners = require('./src/listeners/')

const dataBag = new DataBag
const client = new Discord.Client()
const hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token)

const loginAndReady = async () =>
  new Promise(async (resolve) => {
    await client.login(`Bot ${config.token}`)

    client.on('ready', () => {
      console.log('Booted')
      client.user.setActivity('Booting...')

      resolve()
    })
  })

;(async () => {
  await Promise.all([dataBag.updateAll(), loginAndReady()])

  const resolver = new Resolver(client)

  const commandHandler = new CommandHandler(client, config, resolver)
  const scheduledJobs = new ScheduledJobs(client, config, dataBag)
  const eventLisenters = new EventListeners(client, config, resolver, dataBag, hook)

  client.on('message', (message) => {
    const text = `${message.content}`.trim()
    if (text.charAt(0) === config.prefix) {
      try {
        commandHandler.handle(message)
      } catch (e) {
        message.reply(`${e}`)
      }
    }
  })
})()


