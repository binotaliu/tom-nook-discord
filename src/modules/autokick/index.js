const { createHash } = require('crypto')
const { splitMessage } = require('discord.js')

const dayjs = require('../../dayjs')

const allowedRoles = [
  '546269790537252866', // NPC
  '683253104879206435', // 毫無反應
  '568701794855944223', // 村長
  '546265343459590155', // 島主
  '575562641930452992', // 口袋
  '683184334328299541' // たぬきち 開発
]

const reasonDm = `踢除理由可能包含
-------------------------------------
未閱讀指南並依照公告說明點選獲得身份
-------------------------------------
以上被視為沒有仔細閱讀指南

➥  https://discord.gg/FaQE6aq

如果你仍想繼續參與本群組的討論
歡迎透過上方邀請連結再回到伺服器`

const md5 = (data) => {
  const hash = createHash('md5')
  hash.update(data)
  return hash.digest('hex')
}

module.exports = ({ app, addCommand }) =>
  addCommand('autokick', async (triggerMsg, { time }, confirmText = '') => {
    // list members that need to be kicked
    const members = (await triggerMsg.guild.members.fetch()).array()

    const expires = time ? dayjs(time) : dayjs().subtract(1, 'month')

    if (!expires.isValid()) {
      triggerMsg.channeld.send(`輸入的時間無法識別（${time}），僅支援 Unix Timestamp 或是 ISO 8601 格式的時間。若留空則預設為一個月前。`)
    }

    const kickList = members
      .filter((m) => m.joinedAt.valueOf() <= expires.valueOf())
      .filter((m) => allowedRoles.filter(i => m.roles.cache.has(i)).length <= 0)

    const listMessages = splitMessage(`踢除名單如下：\n${kickList.map(i => `<@${i.id}>`).join('\n')}\n設定期限: ${expires.tz().format('YYYY-MM-DD HH:mm:ss')}`)
    for (const msg of listMessages) {
      triggerMsg.channel.send(msg)
    }

    // concat all members' snowflake and make a hash
    const hash = `${md5(kickList.map(m => m.id).join('\t'))}`

    // if confirm text given, check hash and perform kick
    if (confirmText !== hash) {
      triggerMsg.channel.send(`若確定踢除請輸入: ${app.config.prefix}autokick ${time ? `--time=${time} ` : ''}${hash}`)
      return
    }

    let timeout = 1000

    kickList.forEach(m => {
      setTimeout(async () => {
        try {
          await m.send(reasonDm)
          m.kick('未設定符合規定的暱稱')
          triggerMsg.channel.send(`已踢除 <@${m.id}>`)
        } catch (e) {
          triggerMsg.channel.send(`⚠️ 踢除 <@${m.id}> 失敗，${e}`)
        }
      }, timeout += 1000)

      timeout += 1000
    })
  })
