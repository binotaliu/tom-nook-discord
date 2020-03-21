const commands = require('./commands/')

module.exports = class CommandHandler {
  constructor(client, config) {
    this.client = client
    this.config = config
    this.commands = {}

    commands
      .forEach(command => command({ config, client, addCommand: (...v) => this.addCommand(...v) }))
  }

  addCommand(command, handler) {
    this.commands[command] = handler
  }

  handle(message) {
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

