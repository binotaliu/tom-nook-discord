const axios = require('axios')

const fetchPage = async (pageTitle) =>
  (await axios.get(`https://acnh.tw/api.php?action=parse&formatversion=2&page=${pageTitle}&format=json&prop=wikitext`))
    .data

module.exports = class DataBag {
  constructor () {
    this.events = []
    this.birthdays = {}
  }

  async updateAll () {
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

  async fetchBirthdays () {
    return Object
      .assign({},
        ...((await fetchPage('Bot:NH_Birthdays'))
          .parse
          .wikitext
          .replace(/<!--[\w\W]+?-->/g, '')
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
