const axios = require('axios')

exports.default = async (pageTitle) =>
  (await axios.get(`https://acnh.tw/api.php?action=parse&formatversion=2&page=${pageTitle}&format=json&prop=wikitext`))
    .data

