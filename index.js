const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config').default
const fetchPage = require('./fetch-page').default

const client = new Discord.Client()

;(async () => {

const events = (await fetchPage('Bot:NH_Schedules'))
  .parse
  .wikitext
  .replace(/<\!--[\w\W]+?-->/g, '')
  .split('\n')
  .filter((line) => line.match(/^\s*\*.+?\-.+$/))
  .map(line => line.replace(/^\s*\*/, '').trim())
  .map((line) => { // parse lines
    const event = {
      date: '',
      isFullDay: true,
      startTime: '',
      endTime: '',
      message: ''
    }

    const [dateTimeStr, message] = line.split('-', 2).map(i => i.trim())
    const [dateStr, timeStr] = dateTimeStr.split(' ', 2).map(i => i.trim())

    event.date = dateStr
    event.message = message

    if (timeStr) {
      const [startTime, endTime] = timeStr.split('~', 2).map(i => i.trim())

      event.isFullDay = false
      event.startTime = startTime
      event.endTime = endTime || startTime
    }

    return event
  })

console.log('calendar loaded:')
console.log(...events)

const birthdays = Object
  .assign({},
    ...((await fetchPage('Bot:NH_Birthdays'))
      .parse
      .wikitext
      .replace(/<\!--[\w\W]+?-->/g, '')
      .split('\n')
      .filter((line) => line.match(/^\s*\*\s*.+/))
      .map(line => line.replace(/^\s*\*/, '').trim())
      .map(line => line.split('-', 2).map(i => i.trim()))
      .map(([date, villagers]) => ({
        [date]: villagers.split(',')
      })))
  )

console.log('birthdays loaded:')
console.log(birthdays)

let tickCounter = 0
const tick = () => {
  const today = dayjs()

  const todayEvents = events
    .filter(({ date }) => (date === today.format('YYYY/M/D') || date === today.format('M/D')))
  const todayBirthdays = birthdays[today.format('M/D')]

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

  client.user.setActivity(`${activities[tickCounter % activities.length]} ▫️`, { type: 'PLAYING' })

  tickCounter++
}

client.on('ready', () => {
  client.user.setActivity('Booting...', { type: 'PLAYING' })

  setInterval(() => tick(), 3000)
})

client.login(`Bot ${config.token}`)
})()

