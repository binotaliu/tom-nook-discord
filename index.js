const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config').default
const DataBag = require('./data-bag').default

const nicknamesMaintenance = require('./features/nicknames-maintenance').default

const dataBag = new DataBag
const client = new Discord.Client()

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

  client.user.setActivity(`${activities[Math.floor(Date.now() / 3000) % activities.length]}`, { type: 'PLAYING' })
}

dataBag
  .updateAll()
  .then(() => client.login(`Bot ${config.token}`))
  .then(() => {
    setInterval(() => nicknamesMaintenance(client), 30000)
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

  switch (true) {
    case /^.+?\s*[\|｜]\s*(SW\-|)0000\-0000\-0000?$/.test(nickname): // Invalid
    default:
      updated
        .createDM()
        .then((ch) => ch.send(`${updated.user.username} 你好！你剛才在 ${old.guild.name} 上修改了暱稱，但你設定的暱稱格式並不正確，請參考 #指南 頻道進行修改。\n https://discordapp.com/channels/546242659019390977/546258423398793217`))
      break;
    case /^.+?\s*[\|｜]\s*(\d{4}\-){2}\d{3}$/.test(nickname): // Pocket
      updated.roles.add(updated.guild.roles.cache.filter(i => i.name === '口袋'))
      break;
    case /^.+?\s*[\|｜]\s*(\d{4}\-){2}\d{4}$/.test(nickname): // 3DS NL
      updated.roles.add(updated.guild.roles.cache.filter(i => i.name === '村長'))
      break;
    case /^.+?\s*[\|｜]\s*(SW\-|)(\d{4}\-){2}\d{4}$/.test(nickname): // Switch NH
      updated.roles.add(updated.guild.roles.cache.filter(i => i.name === '島主'))
      break;
  }
})


