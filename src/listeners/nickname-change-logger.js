module.exports = ({ addListener, hooks }) =>
  addListener('guildMemberUpdate', async (old, updated) => {
    if (old.nickname === updated.nickname && old.user.username === old.user.username) {
      return
    }

    const embed = {}

    embed.author = {
      name: `${updated.user.tag}${updated.user.bot ? ' [BOT]' : ''}`,
      icon_url: updated.user.avatar ? `https://cdn.discordapp.com/avatars/${updated.user.id}/${updated.user.avatar}.png` : updated.user.defaultAvatarURL,
      url: `https://discordapp.com/users/${updated.user.id}`
    }

    embed.color = 2123412
    embed.footer = { text: `ID: ${updated.user.id}` }
    embed.timestamp = (new Date()).toISOString()

    if (!old.nickname && updated.nickname) {
      embed.title = 'Nickname Added 新增了暱稱'
      embed.description = `**Before:** _N/A_\n**+After:** ${updated.nickname}`
    } else if (old.nickname && !updated.nickname) {
      embed.title = 'Nickname Removed 移除了暱稱'
      embed.description = `**Before:** ${old.nickname}\n**-After:** _N/A_`
    } else if (old.nickname && updated.nickname && old.nickname !== updated.nickname) {
      embed.title = 'Nickname Changed 修改了暱稱'
      embed.description = `**Before:** ${old.nickname}\n**+After:** ${updated.nickname}`
    } else if (old.user.username !== updated.user.username) {
      embed.title = 'Name Changed 修改了使用者名稱'
      embed.description = `**Before:** ${old.user.username}\n**+After:** ${updated.user.username}`
    } else {
      return
    }

    hooks.logs.send({ content: `<@${updated.user.id}>`, embeds: [embed] })
  })
