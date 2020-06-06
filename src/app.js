const Discord = require('discord.js')
const fsPromises = require('fs').promises
const cron = require('node-cron')
const yargsParser = require('yargs-parser')

const DataBag = require('./data-bag')
const Resolver = require('./resolver')

const stripQuotes = (str) => {
  if (str.length <= 1) {
    return str
  }

  const firstChar = str.charAt(0)
  const lastChar = str.charAt(-1)

  // if not surrounded by quotes
  if (firstChar !== lastChar || (firstChar !== '"' && firstChar !== "'")) {
    return str
  }

  // strip quotes
  return str.slice(1, -1)
}

const loginAndReady = (app) =>
  new Promise((resolve) => {
    app.client.login(`Bot ${app.config.token}`)

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
      if (text.slice(0, this.config.prefix.length) === this.config.prefix) {
        try {
          this.commandHandler(message)
        } catch (e) {
          message.channel.send(`${e.stack}`)
        }
      }
    })

    // transform hooks to hash-map
    this.hooks = Object.assign({}, ...Object.entries((this.config.webhooks || {}))
      .map(([channel, { id, token }]) => ({ [channel]: new Discord.WebhookClient(id, token) })))

    this.dataBag = new DataBag()
    this.resolver = new Resolver(this.client)

    this.modules = {}
    this.commands = {}
  }

  async boot () {
    await Promise.all([this.dataBag.updateAll(), loginAndReady(this)])

    const allowedModules = (process.env.NOOK_MODULES || '').split(',').filter(i => i.length)
    const modules = (await fsPromises.readdir(`${__dirname}/modules`))
      .filter(i => !(/^\.+/i.exec(i)))

    modules
      .forEach(module => {
        if (allowedModules.length <= 0 || allowedModules.findIndex(i => i === module) >= 0) {
          console.log(`Loading module: ${module}`)
          this.modules[module] = this.loadModule(module)
        } else {
          console.log(`Skipped: ${module}`)
        }
      })
  }

  loadModule (name) {
    const module = require(`./modules/${name}`)
    return module({
      app: this,
      addCommand: (command, handler) => { this.commands[command] = handler },
      addJob: (time, handler) => cron.schedule(time, handler, { timezone: 'Asia/Taipei' }),
      addListener: (evnt, handler) => this.client.on(evnt, handler)
    })
  }

  commandHandler (message) {
    if (
      !message.member ||
        this.config.allowCommandRoles.filter(role => message.member.roles.cache.has(role)).length <= 0
    ) {
      return
    }

    // parse command
    const text = `${message.content}`.trim()
    const parsed = yargsParser(text)

    const prefixedCommand = parsed._.shift()
    const command = prefixedCommand.slice(this.config.prefix.length)

    const args = parsed._.map(i => stripQuotes(i))

    const namedArguments = Object
      .assign(
        {},
        ...Object
          .entries(parsed)
          .filter((k) => k !== '_')
          .map(([k, v]) => ({ [k]: stripQuotes(v) }))
      )

    if (!this.commands[command]) {
      message.reply(`不存在的指令: ${command}`)
      return false
    }

    const handler = this.commands[command]
    const requiredArguments = Math.max(handler.length - 2, 0) // include namedArguments, so, - 2

    if (args.length < requiredArguments) {
      throw new Error(`參數數量不正確。該指令需要至少 ${requiredArguments} 個參數，僅傳入 ${args.length} 個。`)
    }

    return handler(message, namedArguments, ...args)
  }
}
