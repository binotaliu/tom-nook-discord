module.exports = ({ app, addCommand }) =>
  addCommand('del', async (triggerMsg, channelId, id) => {
    const channel = await app.client.channels.fetch(channelId)
    const message = await channel.messages.fetch(id)
    message.delete()
  })
