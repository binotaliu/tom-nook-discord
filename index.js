const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config').default
const DataBag = require('./data-bag').default

const client = new Discord.Client()

;(async () => {

const dataBag = new DataBag

await dataBag.updateAll()

console.log('calendar loaded:')
console.log(...dataBag.events)

console.log('birthdays loaded:')
console.log(dataBag.birthdays)

let tickCounter = 0
const tick = () => {
  const today = dayjs()

  const todayEvents = dataBag.events
    .filter(({ date }) => (date === today.format('YYYY/M/D') || date === today.format('M/D')))
  const todayBirthdays = dataBag.birthdays[today.format('M/D')] || []

  const nickname = `${today.format('M/D')} ${todayEvents.map(i => i.message).join('/')}`
  const activities = [...todayEvents.map(e => {
    if (e.isFullDay) {
      return `[整天] ${e.message}`
    }

    return `[${e.startTime}~${e.endTime}] ${e.message}`
  }), ...todayBirthdays.map(b => `🎂 ${b} 生日快樂！`)]

  client.guilds.cache.array().forEach(g => {
    g.me.setNickname(nickname)
  })

  client.user.setActivity(`${activities[tickCounter % activities.length]}`, { type: 'STREAMING' })

  tickCounter++
}

client.on('ready', () => {
  client.user.setActivity('Booting...')

  setInterval(() => tick(), 3000)
})

client.login(`Bot ${config.token}`)

setInterval(() => dataBag.updateAll(), 30000)
})()

