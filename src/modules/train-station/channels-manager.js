const CHANNEL_STATUSES = require('./channel-statuses')
const { getNameById } = require('./platforms')

module.exports = class ChannelsManager {
  constructor(guild) {
    this.channels = {}
    this.guild = guild
  }

  update(id, { lastMessagedAt, status }) {
    if (!this.channels[id]) {
      this.channels[id] = {}
    }

    this.channels[id].lastMessagedAt = lastMessagedAt
    this.channels[id].status = status

    const channel = this.guild.channels.cache.get(id)
    channel.setName(getNameById(id, status === CHANNEL_STATUSES.EMPTY))
  }

  get(id = null) {
    if (!id) {
      return this.channels
    }

    return this.channels[id]
  }
}
