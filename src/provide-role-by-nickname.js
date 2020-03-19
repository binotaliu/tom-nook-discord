module.exports = (member) => {
  const { nickname } = member

  switch (true) {
    case /^.+?\s*[\|｜]\s*(SW\-|)0000\-0000\-0000?$/.test(nickname): // Invalid
    default:
      return false
    case /^.+?\s*[\|｜]\s*(\d{4}\-){2}\d{3}$/.test(nickname): // Pocket
      member.roles.add(member.guild.roles.cache.filter(i => i.name === '口袋'))
      return true
    case /^.+?\s*[\|｜]\s*(\d{4}\-){2}\d{4}$/.test(nickname): // 3DS NL
      member.roles.add(member.guild.roles.cache.filter(i => i.name === '村長'))
      return true
    case /^.+?\s*[\|｜]\s*(SW\-|)(\d{4}\-){2}\d{4}$/.test(nickname): // Switch NH
      member.roles.add(member.guild.roles.cache.filter(i => i.name === '島主'))
      return true
  }

  return false
}

