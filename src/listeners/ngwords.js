const keywords = require('../../ngwords')

module.exports = ({ client, hooks, addListener }) =>
  addListener('message', (message) => {
    if (!message.guild) {
      return
    }

    const match = keywords.find(k => k.exec(message.content.trim()))

    if (!match) {
      return
    }

    message.channel.send('粗鹽警告，建議修改或自刪。')

    hooks.serveillanceCentre.send({
      embeds: [{
        color: 15158332,
        author: {
          name: '粗鹽偵測',
          url: 'https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}',
        },
        description: `**User:** <@${message.author.id}>\n**Channel:** <#${message.channel.id}> \`[${message.channel.name}]\`\n**Triggered Rule:** ${match}\n${message.content}`,
        timestamp: message.createdAt.toISOString(),
        footer: {
          text: `Message ID: ${message.id}`,
        }
      }]
    })
  })

