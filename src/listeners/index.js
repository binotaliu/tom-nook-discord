const emptyPlatformMark = require('./empty-platform-mark')
const dmEcho = require('./dm-echo')
const galleryAutoStar = require('./gallery-auto-star')
const keywordsReply = require('./keywords-reply')
const nicknameChangesWatcher = require('./nickname-changes-watcher')
const nicknameChangeLogger = require('./nickname-change-logger')
const ngwords = require('./ngwords')

const listeners = [
  emptyPlatformMark,
  dmEcho,
  galleryAutoStar,
  keywordsReply,
  nicknameChangesWatcher,
  nicknameChangeLogger,
  ngwords
]

module.exports = class EventListners {
  constructor(app) {
    this.app = app

    const addListener = (evnt, handler) => app.client.on(evnt, handler)
    this.listeners = listeners.map(l => l({ app, addListener }))
  }
}
