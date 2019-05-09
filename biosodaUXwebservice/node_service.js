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
	possibilities = ['gene', 'proteome', 'protein'];
	for (i = 0; i < possibilities.length; i++) {
		if (req.body.q.indexOf(possibilities[i]) >= 0) {
			console.log()
			res.send({'target': possibilities[i]});
			return;
		}
	}
	res.send({'target': null});
});

app.listen(3003, function () {
	console.log('Listening on port 3003');
});