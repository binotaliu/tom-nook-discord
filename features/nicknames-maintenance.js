exports.default = (client) => {
  client
    .guilds
    .cache
    .array()
    .forEach((guild) => {
      guild
        .members
        .fetch()
        .then(members => {
          members
            .array()
            .filter((m) => /^.+\|.+/i.test(m.nickname))
            .forEach((m) => {
              m.setNickname(m.nickname.replace(/\s*\|\s*/, '｜'))
            })
        })
    })
}

