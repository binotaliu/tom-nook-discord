const axios = require('axios')

module.exports = class DataBag {
  constructor (app) {
    this.app = app

    this.lastUpdated = null
    this.events = []
    this.birthdays = {}
    this.meta = {}
  }

  async updateAll (force = false) {
    const { data } = await axios
      .get('https://api.github.com/gists/df6d076c03b2121ddae5079335bbd572', {
        headers: { Authorization: `token ${this.app.config.github}` }
      })
    this.meta = data

    if (data.updated_at === this.lastUpdated) {
      return
    }

    this.lastUpdated = data.updated_at

    this.events = this.parseEvents(data.files['Bot:NH_Schedules.wiki'].content)
    this.birthdays = this.parseBirthdays(data.files['Bot:NH_Birthdays.wiki'].content)
  }

  parseEvents (data) {
    return data
      .replace(/<!--[\w\W]+?-->/g, '')
      .split('\n')
      .filter((line) => line.match(/^\s*\*.+?-.+$/))
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

  parseBirthdays (data) {
    return Object
      .assign({},
        ...data
          .replace(/<!--[\w\W]+?-->/g, '')
          .split('\n')
          .filter((line) => line.match(/^\s*\*\s*.+/))
          .map(line => line.replace(/^\s*\*/, '').trim())
          .map(line => line.split('-', 2).map(i => i.trim()))
          .map(([date, villagers]) => ({
            [date]: villagers.split(',')
          }))
      )
  }
}
