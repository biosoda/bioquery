#!/usr/bin nodejs
// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment
var express = require('express');
	var app = express();
var bodyParser = require('body-parser');
	var urlencodedParser = bodyParser.urlencoded({ extended: false });

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.header("Access-Control-Max-Age", '86400'); // 24 hours
	next();
});

app.get('/', function (req, res) {
	res.send('we don\'t do that kind of business here');
});

app.post('/', urlencodedParser, function (req, res) {
	console.log("========================")
	// console.log(req);
	// console.log(res);
	// console.log(req.body.q);

	if (typeof(req.body.q) !== 'undefined') {
		possibilities = [
			{
				words: 'gene sequence',
				target: 'gene'
			},
			{
				words: 'proteome',
				target: 'proteome'
			},
			{
				words: 'protein factor',
				target: 'protein'
			}
		];
		querywords = req.body.q.split(" ");
		results = [];
		for (j = 0; j < querywords.length; j++) {
			for (i = 0; i < possibilities.length; i++) {
				if (possibilities[i].words.indexOf(querywords[j]) >= 0) {
					results.push(possibilities[i].target);
				}
			}
		}
		console.log(results);
		results = unique(results);
		res.send({'target': results});
		return;
	}

	if (typeof(req.body.a) !== 'undefined') {
		// a is a concept or a chain of concept.attribute.node.edge...
		// OR can we do a full text search of all available tags?
		// can we allready use our SPARQL for this kind of thing? http://jowl.ontologyonline.org/SPARQL-DL.html
	}

});

app.listen(3003, function () {
	console.log('Listening on port 3003');
});

function unique(arr) {
	var u = {}, a = [];
	for(var i = 0, l = arr.length; i < l; ++i){
		if(!u.hasOwnProperty(arr[i])) {
			a.push(arr[i]);
			u[arr[i]] = 1;
		}
	}
	return a;
}