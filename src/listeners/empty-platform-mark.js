const platformChannels = [
  '684443089754128388',
  '574674263924146206',
  '690894152879177729',
  '690894242360328244',
  '691056840095826001',
  '691057367785275442',
  '691057408440533093',
  '691643264436273193',
  '691057488698802217',
  '691057528234180692'
]

const platformNameTemplate = (id) => `${id}号候車月台`

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
    if (/^\+(prune|purge).*/.exec(message.content.trim()) && message.channel.name === baseName) {
      message.channel.setName(`${baseName}｜空`)
    } else {
      message.channel.setName(baseName)
    }
  })

