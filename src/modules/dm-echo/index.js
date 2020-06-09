const getName = (sender, message) => {
  if (message.guild) {
    return `${sender.tag} @ #${message.channel.name}`
  }

  const recipient = message.channel.recipient
  return `${sender.tag}${sender.id === recipient.id ? '' : ` ➤ ${recipient.tag}`}`
}

const getReplyCommand = (prefix, message) => {
  if (message.guild) {
    return `${prefix}say <#${message.channel.id}>`
  }

  return `${prefix}say <#${message.author.id}>`
}

module.exports = ({ app, addListener }) =>
  addListener('message', (message) => {
    if (message.guild && !message.content.match(RegExp(`<@.${app.client.user.id}>`))) {
      return
    }

    const isSelf = message.author.id === app.client.user.id

    const embeds = []

    const color = isSelf ? 9807270 : 15105570

    const sender = message.author

    const author = {
      name: getName(sender, message),
      icon_url: message.author.avatar ? `https://cdn.discordapp.com/avatars/${sender.id}/${sender.avatar}.png` : sender.defaultAvatarURL,
      url: `https://discordapp.com/users/${sender.id}`
    }
    const footer = { text: `CH ID: ${message.channel.id} | MSG ID: ${message.id}` }

    if (message.content) {
      embeds.push({
        color,
        author,
        description: message.content,
        footer
      })
    }

    if (message.attachments.array().length) {
      embeds.push(...message.attachments.map(({ url }) => ({
        color,
        author,
        image: { url },
        footer
      })))
    }

    app.hooks.inbox.send({ embeds, content: isSelf ? '' : getReplyCommand(app.config.prefix, message) })
  })
