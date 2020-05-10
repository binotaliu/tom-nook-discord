module.exports = ({ app, addCommand }) =>
  addCommand('del', async (triggerMsg, channelId, id) => {
    const channel = await app.client.channels.fetch(channelId)
    console.log(channel)
    const message = await app.channel.messages.fetch(id)
    console.log(message)
    message.delete()
  })
