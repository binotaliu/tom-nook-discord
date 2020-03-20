const commands = require('./commands/')

module.exports = class CommandHandler {
  constructor(client, config) {
    this.client = client
    this.config = config
    this.commands = {}

    commands
      .forEach(command => command({ client, addCommand: (...v) => this.addCommand(...v) }))
  }

  addCommand(command, argumentsCount, handler) {
    this.commands[command] = { argumentsCount, handler }
  }

  handle(message) {
    // parse command
    const text = `${message.content}`.trim()
    const [prefixedCommand, ...rawArguments] = text.split(' ')

    if (text.slice(0, this.config.prefix.length) !== this.config.prefix) {
      return false
    }

    const command = prefixedCommand.slice(this.config.prefix.length)

    const { argumentsCount, handler } = this.commands[command]

    const splitedArguments = rawArguments.map(i => i.trim()).filter(i => i)
    const parsedArguments = []

    for (const i in splitedArguments) {
      if (i + 1 >= argumentsCount) {
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

