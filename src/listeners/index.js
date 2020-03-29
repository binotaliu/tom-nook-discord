const emptyPlatformMark = require('./empty-platform-mark')
const dmEcho = require('./dm-echo')
const galleryAutoStar = require('./gallery-auto-star')
const keywordsReply = require('./keywords-reply')
const nicknameChangesWatcher = require('./nickname-changes-watcher')
const ngwords = require('./ngwords')

const listeners = [
  emptyPlatformMark,
  dmEcho,
  galleryAutoStar,
  keywordsReply,
  nicknameChangesWatcher,
  ngwords
]

module.exports = class EventListners {
  constructor(client, config, resolver, dataBag, hook) {
    this.client = client
    this.config = config
    this.resolver = resolver
    this.dataBag = dataBag
    this.hook = hook

    const addListener = (evnt, handler) => client.on(evnt, handler)
    this.listeners = listeners.map(l => l({ client, config, resolver, dataBag, hook, addListener }))
  }
}

