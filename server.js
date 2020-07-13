var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');
var config = require('./config');

var tweets = [];
var filters = config.filters || [];
var port = config.port || 3000;

var twitter = require('node-tweet-stream'),
  t = new twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    token: config.twitter.token,
    token_secret: config.twitter.token_secret
  });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

http.listen(config.port, function () {
  console.log('listening on *:' + port);
});

io.on('connection', function (socket) {
  console.log('user connected');
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

t.on('tweet', function (tweet) {
  filter(tweet, tweets, filters);
});

t.on('error', function (err) {
  io.emit("ohnoes");
});

t.track(process.argv.slice(2) || 'fleek');
console.log('Keywords:', t.tracking());

t.language(config.languages);
console.log('Languages:', t.languages());

// filter out tweets containing strings from filters
function filter(tweet, tweets, filters) {

  var tweetText = getTetweetText(tweet);

  var containing = false;
  for (var i = 0; i < filters.length; i++) {
    if (contains(tweetText, filters[i])) {
      containing = true;
      break;
    }
  }

  if (!containing)
    tweets.push(tweet);
}

// can't believe ecmascript is only now about to fix this
function contains(subject, object) {
  return subject.search(object) !== -1;
}

var serveTweet = function () {
  if (tweets.length > 0) {
    var tweet = tweets.splice(Math.floor(Math.random() * tweets.length), 1)[0];
    io.emit('tweet', tweet.user.screen_name + ": " + getTetweetText(tweet));
  }
}

function getTetweetText(tweet) {
  if(tweet && tweet.truncated) {
    return tweet.extended_tweet.full_text;
  } else {
    return tweet.text;
  }
}

setInterval(serveTweet, config.tweetDelay);