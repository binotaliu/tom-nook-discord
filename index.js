const Discord = require('discord.js')
const dayjs = require('dayjs')
const config = require('./config')
const DataBag = require('./src/data-bag')

const CommandHandler = require('./src/command-handler')

const provideRoleByNickname = require('./src/provide-role-by-nickname')

const ScheduledJobs = require('./src/scheduled-jobs/')

const dataBag = new DataBag
const client = new Discord.Client()
const hook = new Discord.WebhookClient(config.webhook.id, config.webhook.token)

;(async () => {

  await dataBag.updateAll()
  await client.login(`Bot ${config.token}`)

  const commandHandler = new CommandHandler(client, config)
  const scheduledJobs = new ScheduledJobs(client, config, dataBag)
})()

client.on('ready', () => {
  console.log('Booted')
  client.user.setActivity('Booting...')
})

client.on('guildMemberUpdate', (old, updated) => {
  if (old.nickname === updated.nickname) {
    return
  }

  const { nickname } = updated

  if (!provideRoleByNickname(updated)) {
    updated
      .createDM()
      .then((ch) => ch.send(`${updated.user.username} 你好！你剛才在 ${old.guild.name} 上修改了暱稱，但你設定的暱稱格式並不正確，請參考 #指南 頻道進行修改。\n https://discordapp.com/channels/546242659019390977/546258423398793217`))
  }
})

client.on('message', (message) => {
  const text = `${message.content}`.trim()
  if (text.charAt(0) === config.prefix) {
    try {
      commandHandler.handle(message)
    } catch (e) {
      message.reply(`${e}`)
    }
  }
})

client.on('message', (message) => {
  if (message.channel.id !== '546272156460384266' || !message.attachments.array().length) {
    return
  }

  message.react('⭐')
})

client.on('message', (message) => {
  // don't forward messages in guild  (, which means only forward dm)
  if (message.guild) {
    return
  }

  hook.send({
    embeds: [{
      color: message.author.id === client.user.id ? 9807270 : 15105570,
      author: {
        name: `${message.author.tag}${message.author.bot ? ' [BOT]' : ''}`,
        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
        url: `https://discordapp.com/users/${message.author.id}`
      },
      description: message.content,
      footer: { text: `CH ID: ${message.channel.id} | MSG ID: ${message.id}` }
    }]
  })
})

