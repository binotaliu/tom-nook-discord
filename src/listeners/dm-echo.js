module.exports = ({ client, hook, addListener }) =>
  addListener('message', (message) => {
    // don't forward messages in guild  (, which means only forward dm)
    if (message.guild) {
      return
    }

    hook.send({
      embeds: [{
        color: message.author.id === client.user.id ? 9807270 : 15105570,
        author: {
          name: `${message.author.tag}${message.author.bot ? ' [BOT]' : ''}`,
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
          url: `https://discordapp.com/users/${message.author.id}`
        },
        description: message.content,
        footer: { text: `CH ID: ${message.channel.id} | MSG ID: ${message.id}` }
      }]
    })
  })

