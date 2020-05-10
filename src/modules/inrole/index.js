const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))

module.exports = ({ addCommand }) =>
  addCommand('inrole', async (triggerMsg, role, inRawText) => {
    const roleId = role.match(/<@&?(\d+)>/i).slice(1).find(() => true)

    console.log(roleId)

    const list = (await triggerMsg.guild.members.fetch()).array().filter(i => i.roles.cache.has(roleId)).map(i => i.id)

    const listMessages = chunk(list, 8).map(l => l.map(i => `<@${i}>`).join(','))

    for (const msg of listMessages) {
      triggerMsg.channel.send(inRawText === 'yes' ? `\`${msg}\`` : msg)
    }
  })
