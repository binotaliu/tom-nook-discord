const provideRoleByNickname = require('./provide-role-by-nickname')

const ROLE_ID_NL = '568701794855944223'
const ROLE_ID_NS = '546265343459590155'
const ROLE_ID_PC = '575562641930452992'

module.exports = ({ app, addListener, addJob }) => {
  addListener('guildMemberUpdate', async (old, updated) => {
    if (old.nickname === updated.nickname && old.user.username === updated.user.username) {
      return
    }

    const result = provideRoleByNickname(updated)
    const dmch = await updated.createDM()

    if (result === true) {
      dmch.send(`${updated.user.username} 你好！已經幫你新增了權限，請記得按照指南中的說明領取水果哦！（若領到可忽略）`)
      return
    }

    if (result === false) {
      dmch.send(`${updated.user.username} 你好！你剛才在 ${old.guild.name} 上修改了暱稱，但似乎未在暱稱上找到你的 FC，請參考 <#546258423398793217> 設定暱稱。`)
    }
  })

  addJob('0,30 * * * * *', async () => {
    const guilds = app.client.guilds.cache.array()

    for (const guild of guilds) {
      const members = await guild.members.fetch()

      for (const member of members) {
        if (
          member.roles.cache.has(ROLE_ID_NL) ||
              member.roles.cache.has(ROLE_ID_NS) ||
              member.roles.cache.has(ROLE_ID_PC)
        ) {
          continue
        }

        provideRoleByNickname(member)
      }
    }
  })
}
