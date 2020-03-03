const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config').default
const fetchPage = require('./fetch-page').default

const client = new Discord.Client()

class DataBag {
  constructor () {
    this.events = []
    this.birthdays = {}
  }

  async updateAll() {
    return Promise.all([
      this.updateEvents(),
      this.updateBirthdays()
    ])
  }

  async updateEvents () {
    this.events = await this.fetchEvents()
  }

  async updateBirthdays () {
    this.birthdays = await this.fetchBirthdays()
  }

  async fetchEvents () {
    return (await fetchPage('Bot:NH_Schedules'))
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
  }

  async fetchBirthdays () {
    return Object
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
  }
}

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

  client.user.setActivity(`${activities[tickCounter % activities.length]}`)

  tickCounter++
}

client.on('ready', () => {
  client.user.setActivity('Booting...')

  setInterval(() => tick(), 3000)
})

client.login(`Bot ${config.token}`)

setInterval(() => dataBag.updateAll(), 30000)
})()

