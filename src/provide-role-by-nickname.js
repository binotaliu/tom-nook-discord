const ROLES = {
  pc: '575562641930452992',
  nl: '568701794855944223',
  nh: '546265343459590155'
}

module.exports = (member) => {
  const { nickname } = member

  if (Object.values(ROLES).filter(r => member.roles.cache.has(r)).length) {
    return true
  }

  switch (true) {
    case /^.+?\s*[\|｜]\s*(SW\-|)0000\-0000\-0000?$/.test(nickname): // Invalid
    default:
      return false
    case /^.+?\s*[\|｜]\s*(\d{4}\-){2}\d{3}$/.test(nickname): // Pocket
      member.roles.add(ROLES.pc)
      return true
    case /^.+?\s*[\|｜]\s*(\d{4}\-){2}\d{4}$/.test(nickname): // 3DS NL
      member.roles.add(ROLES.nl)
      return true
    case /^.+?\s*[\|｜]\s*(SW\-|)(\d{4}\-){2}\d{4}$/.test(nickname): // Switch NH
      member.roles.add(ROLES.nh)
      return true
  }

  return false
}

