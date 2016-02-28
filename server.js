var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var tweetArray = [];
var filterArray = ["rt ", "http:", "https:", "has"];

var twitter = require('node-tweet-stream'),
    t = new twitter({
        consumer_key: 'guHlvHAlAdTZzRHzygIwXlLXa',
        consumer_secret: '1OmR6CnIcxg7mUw8tgg6167tdBaLVtdnLI9OZLyp7W4wdmGbc8',
        token: '15765133-oJ8FN5J51GPJ58RVbzaMfbIbEDqFPoJzTMnGngL68',
        token_secret: 'C9ZawIKsXecm5iGvjLHfQfJbe0Y5FZhfLUbjfooeP3wDD'
    });

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});

t.on('tweet', function(tweet) {
    filter(tweet, tweetArray, filterArray, 0);
})

t.on('error', function(err) {
    io.emit("ohnoes");
})

t.track('dumm')

// filter out tweets containing strings from filterArray
function filter(tweet, array, filterArray, index) {

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

var serveTweet = function() {
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
setInterval(gc(tweetArray), 300000);
setInterval(serveTweet, 2000);
