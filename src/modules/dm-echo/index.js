module.exports = ({ app, addListener }) =>
  addListener('message', (message) => {
    // don't forward messages in guild  (, which means only forward dm)
    if (message.guild) {
      return
    }

    const isSelf = message.author.id === app.client.user.id

    const embeds = []

    const color = isSelf ? 9807270 : 15105570
    const author = {
      name: `${message.author.tag}${message.author.bot ? ' [BOT]' : ''} | ${message.author.id}`,
      icon_url: message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png` : message.author.defaultAvatarURL,
      url: `https://discordapp.com/users/${message.author.id}`
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

    app.hooks.inbox.send({ embeds, content: isSelf ? '' : `^say <@${message.author.id}>` })
  })
