const epoch = 1584691200000

const CH_ID = '683346217672900675'

module.exports = ({ client, addJob }) => [
  addJob('0 0 0 * * *', async () => {
    const channel = await client.channels.fetch(CH_ID)

    const days = Math.ceil((Date.now() - epoch) / 86400000) + 1

    channel.setName(`還債人生 Day ${days}`)
  })
]

