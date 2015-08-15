var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var tweetArray = [];
var filterArray = ["RT ", "http:", "https:", "has"];

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

var Twitter = require('node-tweet-stream'),
    t = new Twitter({
        consumer_key: '',
        consumer_secret: '',
        token: '',
        token_secret: ''
    })

t.on('tweet', function(tweet) {
    filter(tweet, tweetArray, filterArray, 0);
})

t.on('error', function(err) {
    io.emit("ohnoes");
})

t.track(' af')

var serveTweet = function() {
    if (tweetArray.length > 0) {
        var tweet = tweetArray.splice(Math.floor(Math.random() * tweetArray.length), 1);
        io.emit('tweet', tweet[0].user.screen_name + ": " + tweet[0].text);
    }
}

function filter(tweet, array, filterArray, index) {

    var containing = false;
    for (var i = 0; i < filterArray.length; i++) {
        if (tweet.text.search(filterArray[i]) !== -1) {
            containing = true;
            break;
        }
    }

    if (!containing)
        array.push(tweet);
}

function gc(array) {
	array = [];
}

setInterval(serveTweet, 2000);

// just.. ignore for now that we have to garbage collect.
// pretend we have a fixed size fifo queue that deletes index size+1 objects ;)

// ..seriously, this causes an error "cannot call method 'apply' of undefined" - fix it.
setInterval(gc(tweetArray), 300000);