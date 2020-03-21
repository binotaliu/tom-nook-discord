module.exports = ({ client, addCommand }) =>
  addCommand('say', async (triggerMsg, channelId, message) => {
    client
      .channels
      .fetch(channelId)
      .then((channel) => {
        channel.send(message)
      })
      .catch((e) => {
        triggerMsg.reply('找不到該頻道')
      })
  })

