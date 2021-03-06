const { RateLimiter } = require('limiter')

const keywords = [
  {
    id: '04a9493f-3a1d-4a50-a701-1dad7c037de4',
    trigger: /^因[為爲为]什[么麼]都[没沒]有[!.?…！？\s]*$/gi,
    reply: ['所以什麼都要錢'],
    throttle: [2, 'minute']
  },
  {
    id: '1b445e1a-7d99-48c6-967f-51f63c3c667f',
    trigger: /^什[么麼]都[没沒]有[!.?…！？\s]*$/gi,
    reply: ['什麼都要錢'],
    throttle: [2, 'minute']
  },
  {
    id: 'b81fb0cf-f82c-4af4-963a-46d0ef23b00a',
    trigger: /晚安/gi,
    reply: ['晚安！', '晚安狸！', '晚安', '晚安狸'],
    throttle: [2, 'minute']
  },
  {
    id: '168b574a-275a-4780-a545-762a5eff3c03',
    trigger: /早安/gi,
    reply: ['早！', '早安狸！', '早安！', '早安', '早'],
    throttle: [2, 'minute']
  },
  {
    id: '7fe078fc-d967-4a22-bc0b-d13368ddc211',
    trigger: /午安/gi,
    reply: ['午安！', '午安狸！', '午安', '午安狸'],
    throttle: [2, 'minute']
  },
  {
    id: '0f505437-ee27-4efb-bd19-a978c44a8514',
    trigger: /684078895879946242.*love/gi,
    reply: ['<:HEART:684290314118365204>'],
    throttle: [2, 'minute']
  }
  // {
  //   id: 'bf6643ad-10e9-450e-8e62-a6d0d404eb45',
  //   trigger: /奸商/gi,
  //   reply: ['誰？', '誰?', '你說誰是奸商?', '誰是奸商?'],
  //   throttle: [2, 'minute']
  // }
]

const limiterPool = {}

module.exports = ({ addListener }) =>
  addListener('message', (message) => {
    if (message.author.bot) {
      return
    }

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
      if (err || remaining <= 0) {
        return
      }

      // randomly pick
      const rnd = Math.ceil(Math.random() * (match.reply.length - 1))

      message.channel.send(match.reply[rnd])
    })
  })
