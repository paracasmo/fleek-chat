const fs = require('fs'),
  config = {
    twitter: {
      consumer_key: '',
      consumer_secret: '',
      token: '',
      token_secret: ''
    },
    port: 3000,
    tweetDelay: 2000,
    languages: ['en', 'de'],
    filters: initFilters()
  },
  filterListPath = './config/filterlist.txt'

function initFilters() {
  try {
    fs.access(filterListPath, fs.constants.F_OK)
    return fs.readFileSync(filterListPath, 'utf8').split('\r\n')
  } catch (err) {
    return ['RT ', 'http:', 'https:']
  }
}

module.exports = config