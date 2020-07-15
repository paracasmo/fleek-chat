const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');
const config = require('./config');

const tweets = [];
const filters = config.filters.map((i) => i.toLowerCase()) || [];
const port = config.port || 3000;

const twitter = require('node-tweet-stream'),
  t = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    token: config.twitter.token,
    token_secret: config.twitter.token_secret
  });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(config.port, () => console.log('listening on *:' + port));

io.on('connection', socket =>  {
  console.log('user connected');
  socket.on('disconnect', () => console.log('user disconnected'));
});

t.on('tweet', tweet =>filter(tweet, tweets, filters));

t.on('error', err => io.emit('ohnoes'));

t.track(process.argv.slice(2) || 'fleek');
console.log('Keywords:', t.tracking());

t.language(config.languages);
console.log('Languages:', t.languages());

// filter out tweets containing strings from filters
function filter(tweet, tweets, filters) {
  const tweetText = getTetweetText(tweet);

  let containing = false;
  for (let i = 0; i < filters.length; i++) {
    
    if (tweetText.toLowerCase().includes(filters[i])) {
      containing = true;
      break;
    }
  }

  if (!containing)
    tweets.push(tweet);
}

const serveTweet = () => {
  if (tweets.length > 0) {
    const tweet = tweets.splice(Math.floor(Math.random() * tweets.length), 1)[0];
    const tweetText = getTetweetText(tweet);
    io.emit('tweet', `${tweet.user.screen_name}: ${tweetText}`);
  }
}

const getTetweetText = tweet => {
  if (tweet && tweet.truncated) {
    return tweet.extended_tweet.full_text;
  } else {
    return tweet.text;
  }
}

setInterval(serveTweet, config.tweetDelay);