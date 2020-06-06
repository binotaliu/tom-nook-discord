module.exports = ({ app, addCommand }) =>
  addCommand('say', async (triggerMsg, _, channelId, message) => {
    channelId
      .split(',')
      .forEach(ch => {
        app
          .resolver
          .channel(ch)
          .then((channel) => {
            channel.send(message)
          })
          .catch((e) => {
            triggerMsg.reply(`找不到該頻道: ${ch}`)
          })
      })
  })
