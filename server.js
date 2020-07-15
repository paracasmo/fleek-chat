// imports
const app = require('express')(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  path = require('path'),
  config = require('./config'),
  twitter = require('node-tweet-stream')

// consts
const t = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  token: config.twitter.token,
  token_secret: config.twitter.token_secret
}),
  tweets = [],
  filters = config.filters || [],
  port = config.port || 3000

// configure http app stuff
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))
http.listen(config.port, () => console.log('listening on *:' + port))
io.on('connection', socket => {
  console.log('user connected')
  socket.on('disconnect', () => console.log('user disconnected'))
})

// configure twitter
t.track(process.argv.slice(2) || 'fleek')
t.language(config.languages)
t.on('tweet', tweet => addTweet(tweet))
t.on('error', err => io.emit('ohnoes'))

const addTweet = tweet => {
  if (filters.filter(f => getTetweetText(tweet).includes(f)).length === 0)
    tweets.push(tweet)
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