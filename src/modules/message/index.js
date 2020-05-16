module.exports = ({ app, addCommand }) => {
  addCommand('del', async (triggerMsg, channelId, id) => {
    const channel = await app.resolver.channel(channelId)
    const message = await channel.messages.fetch(id)
    message.delete()
  })

  addCommand('say', async (triggerMsg, channelId, message) => {
    channelId
      .split(',')
      .forEach(ch => {
        app
          .resolver
          .channel(ch)
          .then((channel) => {
            if (triggerMsg.attachments.array().length) {
              channel.send(message, {
                files: triggerMsg.attachments.array()
              })
              return
            }
            channel.send(message)
          })
          .catch((e) => {
            triggerMsg.reply(`找不到該頻道: ${ch}`)
          })
      })
  })
}

