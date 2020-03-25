const keywords = require('../../ngwords')

module.exports = ({ client, addListener }) =>
  addListener('message', (message) => {
    const match = keywords.find(k => k.exec(message.content.trim()))

    if (!match) {
      return
    }

    message.channel.send('粗鹽警告，建議修改或自刪。')
  })

