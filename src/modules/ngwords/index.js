const keywords = require('../../../ngwords')

const silentChannels = [
  '546590314182344744',
  '574674263924146206',
  '690894152879177729',
  '691057528234180692',
  '691056840095826001',
  '691643264436273193',
  '691057408440533093',
  '697781747995246642',
  '697781684346683462',
  '697781809320165457'
]

module.exports = ({ app, addListener }) =>
  addListener('message', (message) => {
    if (!message.guild) {
      return
    }

    const match = keywords.find(k => k.exec(message.content.trim()))

    if (!match) {
      return
    }

    if (!silentChannels.find(i => i === message.channel.id)) {
      message.channel.send('粗鹽警告，建議修改或自刪。')
    }

    app.hooks.serveillanceCentre.send({
      embeds: [{
        color: 15158332,
        author: {
          name: '粗鹽偵測',
          url: `https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`
        },
        description: `**User:** <@${message.author.id}>\n**Channel:** <#${message.channel.id}> \`[${message.channel.name}]\`\n**Triggered Rule:** \`${match}\`\n${message.content}`,
        timestamp: message.createdAt.toISOString(),
        footer: {
          text: `Message ID: ${message.id}`
        }
      }]
    })
  })
