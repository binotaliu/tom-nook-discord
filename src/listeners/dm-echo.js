module.exports = ({ client, hook, addListener }) =>
  addListener('message', (message) => {
    // don't forward messages in guild  (, which means only forward dm)
    if (message.guild) {
      return
    }

    if ((/但你設定的暱稱格式並不正確/gi).exec(message.content) && message.author.id === client.user.id) {
      return
    }

    const isSelf = message.author.id === client.user.id

    const embeds = []

    const color = isSelf ? 9807270 : 15105570
    const author = {
      name: `${message.author.tag}${message.author.bot ? ' [BOT]' : ''} | ${message.author.id}`,
      icon_url: message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${message.author.defaultAvatarURL}.png`,
      url: `https://discordapp.com/users/${message.author.id}`
    }
    const footer = { text: `CH ID: ${message.channel.id} | MSG ID: ${message.id}` }

    if (message.content) {
      embeds.push({
        color,
        author,
        description: message.content,
        footer,
      })
    }

    if (message.attachments.array().length) {
      embeds.push(...message.attachments.map(({ url }) => ({
        color,
        author,
        image: { url },
        footer,
      })))
    }

    hook.send({ embeds, content: isSelf ? '' : `<@${message.author.id}>` })
  })

