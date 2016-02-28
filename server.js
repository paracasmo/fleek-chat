var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var config = require('./config');

var tweetArray = [];
var filterArray = ["RT ", "http:", "https:"];

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
  filter(tweet, tweetArray, filterArray);
})

t.on('error', function (err) {
  io.emit("ohnoes");
})

t.track(process.argv[2] || 'fleek');

// filter out tweets containing strings from filterArray
function filter(tweet, array, filterArray) {

  var containing;
  for (var i = 0; i < filterArray.length; i++)
    if (containing = contains(tweet.text, filterArray[i])) break;
  if (!containing)
    array.push(tweet);
}

// can't believe ecmascript is only now about to fix this
function contains(subject, object) {
  return subject.search(object) !== -1;
}

var serveTweet = function () {
  if (tweetArray.length > 0) {
    var tweet = tweetArray.splice(Math.floor(Math.random() * tweetArray.length), 1);
    io.emit('tweet', tweet[0].user.screen_name + ": " + tweet[0].text);
  }
}

// temporary embarrassment
function gc(array) {
  array = [];
}

// just.. ignore for now that we have to garbage collect.
// pretend we have a fixed size fifo queue that deletes index size+1 objects ;)
// ..seriously, this causes an error "cannot call method 'apply' of undefined" - fix it.
setInterval(gc(tweetArray), config.gcTimer);
setInterval(serveTweet, config.tweetDelay);