module.exports = ({ addCommand }) =>
  addCommand('say', async (triggerMsg, channelId, message) => {
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
