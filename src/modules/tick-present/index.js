const dayjs = require('dayjs')

module.exports = ({ app, addJob }) => [
  addJob('*/3 * * * * *', () => {
    const today = dayjs()

    const todayEvents = app.dataBag.events
      .filter(({ date }) => (date === today.format('YYYY/M/D') || date === today.format('M/D')))
    const todayBirthdays = app.dataBag.birthdays[today.format('M/D')] || []

    const nickname = todayEvents.length ? `${today.format('M/D')} ${todayEvents.map(i => i.message).join('/')}` : '狸克'
    const activities = [
      ...todayEvents.map((e) => e.isFullDay ? `[整天] ${e.message}` : `[${e.startTime}~${e.endTime}] ${e.message}`),
      ...todayBirthdays.map(b => `🎂 ${b} 生日快樂！`)
    ]

    app.client.guilds.cache.array().forEach(g => {
      g.me.setNickname(nickname)
    })

    if (activities.length) {
      app.client.user.setActivity(`${activities[Math.floor(Date.now() / 3000) % activities.length]}`, { type: 'PLAYING' })
    } else {
      app.client.user.setPresence({ activity: null })
    }
  })
]
