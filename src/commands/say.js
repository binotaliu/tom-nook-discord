module.exports = ({ client, resolver, addCommand }) =>
  addCommand('say', async (triggerMsg, channelId, message) => {
    resolver
      .channel(channelId)
      .then((channel) => {
        channel.send(message)
      })
      .catch((e) => {
        triggerMsg.reply('找不到該頻道')
      })
  })

