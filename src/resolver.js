module.exports = class Resolver {
  constructor (client) {
    this.client = client
  }

  async channel (input, allowDm = true) {
    console.log(input)
    if (/^\d+$/.test(input)) {
      console.log('resolve raw')
      return await this.client.channels.fetch(input)
    }

    if (/^<#(\d+)>/gi.test(input)) {
      console.log('resolve mention')
      const chId = input.match(/^<#(\d+)>/i).slice(1).find(() => true) || null

      return await this.client.channels.fetch(chId)
    }

    if (allowDm && /^<.*@[!&]?(\d+)>/gi.test(input)) {
      console.log('resolve dm')
      const uid = input.match(/^<.*@[!&]?(\d+)>/i).slice(1).find(() => true) || null

      console.log(`uid ${uid}`)

      return await (await this.client.users.fetch(uid)).createDM()
    }

    throw `Channel not found: ${input}`
  }

  async user (input) {
    if (/^\d+$/.test(input)) {
      return await this.client.users.fetch(input)
    }

    if (/^<.*@[!&]?(\d+)>/gi.test(input)) {
      const uid = input.match(/^<.*@&?(\d+)>/gi).slice(1).find(() => true) || null

      return await this.client.users.fetch(uid).createDM()
    }

    throw `Channel not found: ${input}`
  }
}
