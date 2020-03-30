const platformChannels = [
  '684443089754128388',
  '574674263924146206',
  '690894152879177729',
  '691057528234180692',
  '691056840095826001',
  '691643264436273193',
  '691057408440533093',
]

const platformNameTemplate = (id) => `${id}号候車月台`

const emptyMark = '｜空'

module.exports = ({ addListener }) =>
  addListener('message', (message) => {
    // ignore bot message
    if (message.author.bot) {
      return
    }

    const platformNumber = platformChannels.findIndex(i => i === message.channel.id) + 1

    if (platformNumber <= 0) {
      return
    }

    const baseName = platformNameTemplate(platformNumber)
    if (/^\+(prune|purge).*/.exec(message.content.trim()) && (message.channel.name === baseName || message.channel.name === `${baseName}${emptyMark}`)) {
      message.channel.setName(`${baseName}${emptyMark}`)
    } else {
      message.channel.setName(baseName)
    }
  })

