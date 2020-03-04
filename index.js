const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config').default
const DataBag = require('./data-bag').default

const dataBag = new DataBag
const client = new Discord.Client()

let tickCounter = 0
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

  client.user.setActivity(`${activities[tickCounter % activities.length]}`, { type: 'PLAYING' })

  tickCounter++
}

dataBag
  .updateAll()
  .then(() => client.login(`Bot ${config.token}`))
  .then(() => {
    setInterval(() => dataBag.updateAll(), 30000)
    setInterval(() => tick(), 3000)
  })

client.on('ready', () => {
  console.log('Booted')
  client.user.setActivity('Booting...')
})


