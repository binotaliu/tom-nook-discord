const cron = require('node-cron')
const Discord = require('discord.js')
const fsPromises = require('fs').promises

const DataBag = require('./data-bag')
const Resolver = require('./resolver')

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

        // binding for message handler
        this.client.on('message', (message) => {
          const text = `${message.content}`.trim()
          if (text.charAt(0) === this.config.prefix) {
            try {
              this.messageHandler(message)
            } catch (e) {
              message.reply(`${e}`)
            }
          }
        })

        // transform hooks to hash-map
        this.hooks = Object.assign({}, ...Object.entries((this.config.webhooks || {}))
          .map(([channel, { id, token }]) => ({ [channel]: new Discord.WebhookClient(id, token) })))

        this.dataBag = new DataBag
        this.resolver = new Resolver(this.client)

        this.modules = {}
        this.commands = {}
    }

    async boot() {
        await Promise.all([this.dataBag.updateAll(), loginAndReady(this)])

        const allowedModules = (process.env.NOOK_MODULES || '').split(',')
        const modules = (await fsPromises.readdir(`${__dirname}/modules`))
          .filter(i => !(/^\.+/i.exec(i)))
          .filter(i => allowedModules.length > 0 ? allowedModules.indexOf(i) >= 0 : true)

        modules
          .forEach(module => {
            console.log(`Loading module: ${module}`)
            this.modules[module] = this.loadModule(module)
          })
    }

    loadModule(name) {
      const module = require(`./modules/${name}`)
      return module({
        app: this,
        addCommand: (command, handler) => this.commands[command] = handler,
        addJob: (time, handler) => cron.schedule(time, handler, { timezone: 'Asia/Taipei' }),
        addListener: (evnt, handler) => this.client.on(evnt, handler)
      })
    }

    messageHandler(message) {
      if (
        !message.member ||
        this.config.allowCommandRoles.filter(role => message.member.roles.cache.has(role)).length <= 0
      ) {
        return
      }

      // parse command
      const text = `${message.content}`.trim()
      const [prefixedCommand, ...rawArguments] = text.split(' ')

      if (text.slice(0, this.config.prefix.length) !== this.config.prefix) {
        return false
      }

      const command = prefixedCommand.slice(this.config.prefix.length)

      if (!this.commands[command]) {
        message.reply(`不存在的指令: ${command}`)
        return false
      }

      const handler = this.commands[command]
      const argumentsCount = handler.length - 1

      const splitedArguments = rawArguments.map(i => i.trim()).filter(i => i)
      const parsedArguments = []

      for (const i in splitedArguments) {
        if (argumentsCount && i + 1 >= argumentsCount) {
          parsedArguments.push(splitedArguments.slice(i).join(' '))
          break
        }

        parsedArguments.push(splitedArguments[i])
      }

      if (parsedArguments.length !== argumentsCount) {
        throw `Arguments count does not match. Required ${argumentsCount}, given ${parsedArguments.length}`
      }

      return handler(message, ...parsedArguments)
    }
}
