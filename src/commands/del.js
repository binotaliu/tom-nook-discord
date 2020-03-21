const Discord = require('discord.js')

module.exports = ({ client, addCommand }) =>
  addCommand('del', 2, async (triggerMsg, channelId, id) => {
    const channel = await client.channels.fetch(channelId)
    console.log(channel)
    const message = await channel.messages.fetch(id)
    console.log(message)
    message.delete()
  })

