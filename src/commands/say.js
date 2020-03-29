module.exports = ({ client, resolver, addCommand }) =>
  addCommand('say', async (triggerMsg, channelId, message) => {
    channelId
      .split(',')
      .forEach(ch => {
        resolver
          .channel(ch)
          .then((channel) => {
            channel.send(message)
          })
          .catch((e) => {
            triggerMsg.reply(`找不到該頻道: ${ch}`)
          })
      })
  })

