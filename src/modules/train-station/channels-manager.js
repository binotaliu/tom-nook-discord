const CHANNEL_STATUSES = require('./channel-statuses')
const { platforms, getNameById } = require('./platforms')

module.exports = class ChannelsManager {
  constructor (guild) {
    this.channels = {}
    this.guild = guild

    this._fetchInfo()
  }

  async _fetchInfo() {
    const ids = platforms.map(i => i.id)

    for (const id of ids) {
      const channel = this.guild.channels.resolve(id)
      if (!channel) {
        continue
      }

      const lastMessage = (await channel.messages.fetch({ limit: 1 })).array().find(() => true)

      if (!lastMessage) {
        continue
      }

      const lastMessagedAt = lastMessage.createdAt.valueOf()
      const status = /空$/.exec(channel.name) ? CHANNEL_STATUSES.EMPTY : CHANNEL_STATUSES.ACTIVE

      this.channels[id] = { lastMessagedAt, status }
    }
  }

  update (id, { lastMessagedAt, status }) {
    if (!this.channels[id]) {
      this.channels[id] = {}
    }

    this.channels[id].lastMessagedAt = lastMessagedAt
    this.channels[id].status = status

    const channel = this.guild.channels.cache.get(id)
    channel.setName(getNameById(id, status === CHANNEL_STATUSES.EMPTY))
  }

  get (id = null) {
    if (!id) {
      return this.channels
    }

    return this.channels[id]
  }
}
