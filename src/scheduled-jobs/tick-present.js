const dayjs = require('dayjs')

module.exports = ({ client, dataBag, addJob }) => {
  addJob('*/3 * * * * *', () => {
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
  })
}

