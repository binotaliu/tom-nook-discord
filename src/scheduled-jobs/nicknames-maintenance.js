module.exports = ({ client, addJob }) =>
  addJob(
    '0,30 * * * * *',
    () =>
      client
        .guilds
        .cache
        .array()
        .forEach((guild) =>
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
      )
  )

