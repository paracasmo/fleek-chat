var tweet1 = {
    "text": "RT @Ahmadiraqi21_: Bro u r right af ☺️❤️ http://t.co/dJYiHLEenj"
}
var tweet2 = {
    "text": "RT @tayyyylloorr: @jordan_renae_ us af 😂💓 https://t.co/4H9MnJI4r7"
}
var tweet3 = {
    "text": "Photo: dollskill: ❤️💛💚💙💜HAIR GOALS AF❤️💛💚💙💜 omg @rainbowmegz http://t.co/8ozXWlLNH0 (at ❤️💛💚💙💜❤️💛💚💙💜) http://t.co/koTP625CNy"
}
var tweet4 = {
    "text": "lorem"
}

var tweets = [tweet1, tweet2, tweet3, tweet4];
var filterArray = ["RT ", " http", "has"];

var contains = function(string, filterArray) {
	
	for(var i = 0; i < filterArray.length; i++) {
		console.log("filtering: " + string);

		if(string.search(filterArray[i]) !== -1) {
			return true;
		}
		else {
			return false;
		}
	}
}

console.log(contains(tweets[3].text, filterArray));

for(var i = 0; i < tweets.length; i++) {
	var contained = contains(tweets[i].text, filterArray);
	console.log(contained);
}

console.log("the end.");