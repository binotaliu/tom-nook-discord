module.exports = ({ app, addCommand }) =>
  addCommand('say', async (triggerMsg, _, channelId, message) => {
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
