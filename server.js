// imports
const app = require('express')(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  path = require('path'),
  config = require('./config'),
  twitter = require('node-tweet-stream')


// configure http app stuff
const port = config.port || 3000
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
http.listen(port, () => console.log('listening on *:' + port))

// configure twitter
const t = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  token: config.twitter.token,
  token_secret: config.twitter.token_secret
}),
  filters = config.filters || [],
  tweets = []

t.track(process.argv.slice(2) || 'fleek')
t.language(config.languages)
t.on('tweet', tweet => addTweet(tweet))
t.on('error', err => io.emit('ohnoes'))

// helpers
const addTweet = tweet => {
  const tweetText = getTetweetText(tweet)
  if (!filters.find(f => tweetText.includes(f))) {
    tweets.push(tweet)
  }
}

const serveTweet = () => {
  if (tweets.length > 0) {
    const tweet = tweets.splice(Math.floor(Math.random() * tweets.length), 1)[0]
    const tweetText = getTetweetText(tweet)
    io.emit('tweet', `${tweet.user.screen_name}: ${tweetText}`)
  }
}

const getTetweetText = tweet => tweet.truncated ? tweet.extended_tweet.full_text : tweet.text

// do the thing
console.log('Keywords:', t.tracking())
console.log('Languages:', t.languages())
setInterval(serveTweet, config.tweetDelay)