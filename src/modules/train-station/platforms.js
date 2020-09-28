const nameTemplate = (id, empty = false) => `${id}号候車月台${empty ? '｜空' : ''}`

const platforms = [
  {
    id: '684443089754128388',
    number: 1,
    emoji: '1️⃣',
    conductor_role: '694825510399639562'
  },
  {
    id: '574674263924146206',
    number: 2,
    emoji: '2️⃣',
    conductor_role: '694825601424424971'
  },
  {
    id: '690894152879177729',
    number: 3,
    emoji: '3️⃣',
    conductor_role: '694825641836675143'
  },
  {
    id: '691057528234180692',
    number: 4,
    emoji: '4️⃣',
    conductor_role: '694825664875987007'
  },
  {
    id: '691056840095826001',
    number: 5,
    emoji: '5️⃣',
    conductor_role: '694825688099979335'
  },
  {
    id: '691643264436273193',
    number: 6,
    emoji: '6️⃣',
    conductor_role: '694825709558038549'
  }
]

const empty = { id: null, number: null, emoji: null }

const isPlatform = (id) => platforms.findIndex(i => i.id === id) >= 0

const getPlatformId = (number) => (platforms.find(i => i.number === number) || {}).id || null
const getPlatformNumber = (id) => (platforms.find(i => i.id === id) || {}).number || null

const getFromEmoji = (emoji) => platforms.find(i => i.emoji === emoji) || empty
const getFromNumber = (number) => platforms.find(i => i.number === number) || empty
const getFromId = (id) => platforms.find(i => i.id === id) || empty

const getNameById = (id, isEmpty = false) => nameTemplate(getPlatformNumber(id), isEmpty)
const getNameByNumber = (number, isEmpty = false) => nameTemplate(number, isEmpty)

module.exports = {
  platforms,

  isPlatform,

  getPlatformId,
  getPlatformNumber,

  getFromEmoji,
  getFromNumber,
  getFromId,

  getNameById,
  getNameByNumber
}
