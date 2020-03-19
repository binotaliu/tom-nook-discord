const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config')
const DataBag = require('./src/data-bag')

const provideRoleByNickname = require('./src/provide-role-by-nickname')
const nicknamesMaintenance = require('./src/features/nicknames-maintenance')
const rolesConfirmation = require('./src/features/roles-confirmation')

const dataBag = new DataBag
const client = new Discord.Client()

const hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token)

const tick = () => {
  const today = dayjs()

  const todayEvents = dataBag.events
    .filter(({ date }) => (date === today.format('YYYY/M/D') || date === today.format('M/D')))
  const todayBirthdays = dataBag.birthdays[today.format('M/D')] || []

  const nickname = `${today.format('M/D')} ${todayEvents.map(i => i.message).join('/')}`
  const activities = [
    ...todayEvents.map((e) => e.isFullDay ? `[整天] ${e.message}` : `[${e.startTime}~${e.endTime}] ${e.message}`),
    ...todayBirthdays.map(b => `🎂 ${b} 生日快樂！`)
  ]

  client.guilds.cache.array().forEach(g => {
    g.me.setNickname(nickname)
  })

  if (activities.length) {
    client.user.setActivity(`${activities[Math.floor(Date.now() / 3000) % activities.length]}`, { type: 'PLAYING' })
  } else {
    client.user.setPresence({ activity: null })
  }
}

dataBag
  .updateAll()
  .then(() => client.login(`Bot ${config.token}`))
  .then(() => {
    setInterval(() => nicknamesMaintenance(client), 30000)
    setInterval(() => rolesConfirmation(client), 30000)
    setInterval(() => dataBag.updateAll(), 30000)
    setInterval(() => tick(), 3000)
  })

client.on('ready', () => {
  console.log('Booted')
  client.user.setActivity('Booting...')
})

client.on('guildMemberUpdate', (old, updated) => {
  if (old.nickname === updated.nickname) {
    return
  }

  const { nickname } = updated

  if (!provideRoleByNickname(updated)) {
    updated
      .createDM()
      .then((ch) => ch.send(`${updated.user.username} 你好！你剛才在 ${old.guild.name} 上修改了暱稱，但你設定的暱稱格式並不正確，請參考 #指南 頻道進行修改。\n https://discordapp.com/channels/546242659019390977/546258423398793217`))
  }
})

client.on('message', (message) => {
  if (message.guild) {
    return
  }

  hook.send({
    embeds: [{
      color: message.author.id === client.user.id ? 9807270 : 15105570,
      author: {
        name: `${message.author.tag}${message.author.bot ? ' [BOT]' : ''}`,
        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
        url: `https://discordapp.com/users/${message.author.id}`
      },
      description: message.content,
      footer: { text: `CH ID: ${message.channel.id}` }
    }]
  })
})

