const provideRoleByNickname = require('../provide-role-by-nickname')

const ROLE_ID_NL = '568701794855944223'
const ROLE_ID_NS = '546265343459590155'
const ROLE_ID_PC = '575562641930452992'

module.exports = ({ client, addJob }) => [
  addJob(
    '0,30 * * * * *',
    () =>
      client
        .guilds
        .cache
        .array()
        .forEach(async (guild) => {
          const members = await guild.members.fetch()
          members
            .array()
            .forEach((member) => {
              if (
                member.roles.cache.has(ROLE_ID_NL) ||
                member.roles.cache.has(ROLE_ID_NS) ||
                member.roles.cache.has(ROLE_ID_PC)
              ) {
                return
              }

              provideRoleByNickname(member)
            })
        })
  )
]

