var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
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
  res.sendfile('index.html');
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
})

t.on('error', function (err) {
  io.emit("ohnoes");
})

t.track(process.argv[2] || 'fleek');

// filter out tweets containing strings from filters
function filter(tweet, tweets, filters) {

  var containing = false;
  for (var i = 0; i < filters.length; i++) {
    if (contains(tweet.text, filters[i])) {
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
    io.emit('tweet', tweet.user.screen_name + ": " + tweet.text);
  }
}

// temporary embarrassment
function gc(array) {
  array = [];
}

// just.. ignore for now that we have to garbage collect.
// pretend we have a fixed size fifo queue that deletes index size+1 objects ;)
// ..seriously, this causes an error "cannot call method 'apply' of undefined" - fix it.
setInterval(gc(tweets), config.gcTimer);
setInterval(serveTweet, config.tweetDelay);