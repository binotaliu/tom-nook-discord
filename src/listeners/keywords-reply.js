const { RateLimiter } = require('limiter')

const keywords = [
  {
    id: '04a9493f-3a1d-4a50-a701-1dad7c037de4',
    trigger: /^因[為爲为]什[么麼]都[没沒]有[\!\.\?…！？\s]*$/gi,
    reply: ['所以什麼都要錢'],
    throttle: [2, 'minute']
  },
  {
    id: '1b445e1a-7d99-48c6-967f-51f63c3c667f',
    trigger: /^什[么麼]都[没沒]有[\!\.\?…！？\s]*$/gi,
    reply: ['什麼都要錢'],
    throttle: [2, 'minute']
  }
]

const limiterPool = {}

module.exports = ({ client, hook, addListener }) =>
  addListener('message', (message) => {
    const match = keywords.find(k => k.trigger.exec(message.content))

    if (!match) {
      return
    }

    const limiterId = `${message.channel.id}-${match.id}`
    if (!limiterPool[limiterId]) {
      limiterPool[limiterId] = new RateLimiter(...match.throttle, true)
    }

    const limiter = limiterPool[limiterId]

    limiter.removeTokens(1, (err, remaining) => {
      if (remaining <= 0) {
        return
      }

      // randomly pick
      const rnd = Math.ceil(Math.random() * (match.reply.length - 1))

      message.channel.send(match.reply[rnd])
    })
  })

