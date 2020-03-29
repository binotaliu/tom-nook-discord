const keywords = require('../../ngwords')

module.exports = ({ client, hooks, addListener }) =>
  addListener('message', (message) => {
    const match = keywords.find(k => k.exec(message.content.trim()))

    if (!match) {
      return
    }

    message.channel.send('粗鹽警告，建議修改或自刪。')

    hooks.serveillanceCentre.send({
      embeds: [{
        color: 15158332,
        title: '粗鹽偵測',
        description: `**User:** <@${message.author.id}>\n**Channel:** <#${message.channel.id}> `[${message.channel.name}]`\n**Triggered Rule:** ${match}\n${message.content}`,
        footer: {
          text: `Message ID: ${message.id}`,
        }
      }]
    })
  })

