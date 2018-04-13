require('dotenv').config()
const express = require('express')
const Twitter = require('twitter');
const sentiment = require('sentiment');
const colors = require('colors');

const app = express()
const client = new Twitter({
	consumer_key: process.env.consumer_key,
	consumer_secret: process.env.consumer_secret,
	access_token_key: process.env.access_token_key,
	access_token_secret: process.env.access_token_secret
});

const params = { 
	screen_name: process.env.screen_name, 	//-- This is the Twitter Username
	count: 50, 								//-- How far back in tweets should we go?
	include_rts: false 				//-- Include retweets in this?
}

app.get('/', (req, res) => {
	// getTweets
	getTweets(function () {
		console.log('done')
		res.send('200')
	})
})

app.listen(3000, () => console.log('Live listening on port 3000!'))

function getTweets(done)
{
	client.get('statuses/user_timeline', { screen_name: 'Denilsun', count: 50, include_rts: false}, function(error, tweets, response) {
	  if (!error) {
	    Object.keys(tweets).forEach(function(key) {
	    	checkTweetIsHappy(tweets[key])
			})
			done()
	  }
	});	
}

function checkTweetIsHappy(tweet)
{
	const text = tweet.text
	//-- Sentiment provides us with a score from -5 to 5 for how
	//-- happy sunil has tweeted
	let happyTest = sentiment(text)
	let theScore = happyTest.comparative.toFixed(1);
	let theDate = new Date(tweet.created_at);
	let fromDate = new Date("2018-04-11 22:00:00");

	if (theDate < fromDate)
	{
		//-- Before the date we need
		return false;
	}
	else
	{
		let theNiceDate = "[" + theDate.toDateString() + "] "
		if (happyTest.comparative < 0) { console.log(colors.red(theNiceDate + Math.abs(theScore) + " " + text)) }
		if (happyTest.comparative == 0) { console.log(colors.yellow(theNiceDate + theScore + " " + text)) }
		if (happyTest.comparative > 0) { console.log(colors.green(theNiceDate + theScore + " " + text)) }
	}
}