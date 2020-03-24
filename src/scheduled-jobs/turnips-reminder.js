const epoch = 1584691200000

const CH_ID = '691016838443827286'

module.exports = ({ client, addJob }) => [
  addJob('0 0 5 8 * * 1-6', async () => {
    const channel = await client.channels.fetch(CH_ID)

    const date = dayjs().format('MM/DD')
    channel.send(`以下開放 ${date} __上午賣價__ 報價`)
  }),
  addJob('0 0 5 12 * * 1-6', async () => {
    const channel = await client.channels.fetch(CH_ID)

    const date = dayjs().format('MM/DD')
    channel.send(`以下開放 ${date} __下午賣價__ 報價`)
  }),
  addJob('0 0 5 8 * * 7', async () => {
    const channel = await client.channels.fetch(CH_ID)

    const date = dayjs().format('MM/DD')
    channel.send(`以下開放 ${date} __買價__ 報價`)
  })
]

