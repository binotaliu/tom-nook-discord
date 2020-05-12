const provideRoleByNickname = require('../../provide-role-by-nickname')

module.exports = ({ addListener }) =>
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
