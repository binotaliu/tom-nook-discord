const { createHash } = require('crypto')

const dayjs = require('dayjs')
const { splitMessage } = require('discord.js')

const allowedRoles = [
  '546269790537252866', // NPC
  '683253104879206435', // 毫無反應
  '568701794855944223', // 村長
  '546265343459590155', // 島主
  '575562641930452992' // 口袋
]

const reasonDm = `踢除理由可能包含
-------------------------------------
❶ 從未設置群暱稱FC
❷ 長久未領取對應身份組權限
-------------------------------------
以上被視為沒有仔細閱讀指南

➥  https://discord.gg/FaQE6aq

仍然歡迎透過上方邀請連結再回到伺服器
下回請詳讀指南並完成門檻設置`

const md5 = (data) => {
  const hash = createHash('md5')
  hash.update(data)
  return hash.digest('hex')
}

module.exports = ({ app, addCommand }) =>
  addCommand('autokick', async (triggerMsg, _, confirmText = '') => {
    // list members that need to be kicked
    const members = (await triggerMsg.guild.members.fetch()).array()

    const expires = dayjs().subtract(1, 'month')

    const kickList = members
      .filter((m) => m.joinedAt.valueOf() <= expires.valueOf())
      .filter((m) => allowedRoles.filter(i => m.roles.cache.has(i)).length <= 0)

    const listMessages = splitMessage(`踢除名單如下：\n${kickList.map(i => `<@${i.id}>`).join('\n')}\n設定期限: ${expires.format('YYYY-MM-DD HH:mm:ss')}`)
    for (const msg of listMessages) {
      triggerMsg.channel.send(msg)
    }

    // concat all members' snowflake and make a hash
    const hash = `${md5(kickList.map(m => m.id).join('\t'))}`

    // if confirm text given, check hash and perform kick
    if (confirmText === hash) {
      kickList.forEach(m => {
        m.kick('未設定符合規定的暱稱')
        m.send(reasonDm)
      })
    } else {
      triggerMsg.channel.send(`若確定踢除請輸入: ${app.config.prefix}autokick ${hash}`)
    }
  })
