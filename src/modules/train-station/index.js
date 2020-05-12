const CHANNEL_STATUSES = require('./channel-statuses')
const ChannelsManager = require('./channels-manager')
const { isPlatform, getFromEmoji, getFromId } = require('./platforms')

const starBoardId = {
  guild: '546242659019390977',
  channel: '546590314182344744',
  message: '546592455542439947'
}

module.exports = async ({ app, addJob, addListener }) => {
  const guild = app.client.guilds.cache.get(starBoardId.guild)
  const getChannel = (id) => guild.channels.resolve(id)

  const channelsManager = new ChannelsManager(guild)

  const starBoard = await guild
    .channels.cache.get(starBoardId.channel)
    .messages
    .fetch(starBoardId.message)

  const createCollector = () => {
    const starBoardCollector = starBoard
      .createReactionCollector(() => true, { dispose: true })

    starBoardCollector.on('collect', (reaction) => {
      const { id } = getFromEmoji(reaction.emoji.name)
      id && channelsManager.update(id, { status: CHANNEL_STATUSES.ACTIVE })
    })

    starBoardCollector.on('remove', (reaction) => {
      if (reaction.users.cache.array().length > 2) {
        return
      }

      const { id } = getFromEmoji(reaction.emoji.name)
      id && channelsManager.update(id, { status: CHANNEL_STATUSES.EMPTY })
    })

    starBoardCollector.on('end', () => {
      createCollector()
    })
  }

  createCollector()

  addJob('* * * * * *', () => {
    const warnTime = Date.now() - (1000 * 60 * 25)
    const expireTime = Date.now() - (1000 * 60 * 30)

    const expiredChannels = Object
      .entries(channelsManager.get())
      .filter(([, { lastMessagedAt }]) => lastMessagedAt <= warnTime)
      .map(([id, { lastMessagedAt, status }]) => ({ id, lastMessagedAt, status }))

    expiredChannels.forEach(({ id, lastMessagedAt, status }) => {
      const channel = getChannel(id)

      switch (status) {
        case CHANNEL_STATUSES.ACTIVE:
          channelsManager.update(id, { lastMessagedAt, status: CHANNEL_STATUSES.WARNED })
          channel.send('該月台已閒置超過 25 分鐘，若五分鐘內未有任何新訊息將標示為空月台。')
          break;
        case CHANNEL_STATUSES.WARNED:
          if (lastMessagedAt > expireTime) {
            break;
          }

          channelsManager.update(id, { lastMessagedAt, status: CHANNEL_STATUSES.EMPTY })

          const { emoji } = getFromId(id)

          const reactions = starBoard.reactions.cache.array()
          const reaction = reactions.find(i => i.emoji.name === emoji)
          if (!reaction) {
            return
          }

          const users = reaction.users.cache.array().filter(i => !i.bot)
          users.forEach((user) => {
            reaction.users.remove(user.id)
          })
          break;
      }
    })
  })

  addListener('message', async (message) => {
    // ignore bot message
    if (message.author.bot) {
      return
    }

    if (!isPlatform(message.channel.id)) {
      return
    }

    const { emoji } = getFromId(message.channel.id)
    const { status: originalStatus } = channelsManager.get(message.channel.id) || { status: null }

    channelsManager.update(message.channel.id, {
      lastMessagedAt: message.createdAt.valueOf(),
      status: CHANNEL_STATUSES.ACTIVE
    })

    if (originalStatus !== CHANNEL_STATUSES.EMPTY && originalStatus !== null) {
      return
    }

    const reactions = starBoard.reactions.cache.array()
    const reaction = reactions.find(i => i.emoji.name === emoji)

    if (reaction.count > 1) {
      return
    }

    message.channel.send('該月台還沒有車長，可前往廣播領取權限！\nhttps://discordapp.com/channels/546242659019390977/546590314182344744/546592455542439947')
  })
}
