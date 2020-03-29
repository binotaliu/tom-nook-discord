const provideRoleByNickname = require('../provide-role-by-nickname')

module.exports = ({ addListener }) =>
  addListener('guildMemberUpdate', async (old, updated) => {
    if (old.nickname === updated.nickname && old.user.username === old.user.username) {
      return
    }

    if (provideRoleByNickname(updated)) {
      return
    }

    const dmch = await updated.createDM()
    dmch.send(`${updated.user.username} 你好！你剛才在 ${old.guild.name} 上修改了暱稱，但你設定的暱稱格式並不正確，請參考 #⚠旅人指南 頻道進行修改。\n https://discordapp.com/channels/546242659019390977/546258423398793217`)
  })
