const dmEcho = require('./dm-echo')
const galleryAutoStar = require('./gallery-auto-star')
const nicknameChangesWatcher = require('./nickname-changes-watcher')

const listeners = [
  dmEcho,
  galleryAutoStar,
  nicknameChangesWatcher,
]

module.exports = class EventListners {
  constructor(client, config, dataBag, hook) {
    this.client = client
    this.config = config
    this.dataBag = dataBag
    this.hook = hook

    const addListener = (evnt, handler) => client.on(evnt, handler)
    this.listeners = listeners.map(l => l({ client, config, dataBag, hook, addListener }))
  }
}

