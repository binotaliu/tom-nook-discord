const CH_ID = '546272156460384266'

module.exports = ({ addListener }) =>
  addListener('message', (message) => {
    if (message.channel.id !== CH_ID || !message.attachments.array().length) {
      return
    }

    message.react('⭐')
  })
