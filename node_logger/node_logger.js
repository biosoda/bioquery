#!/usr/bin nodejs
// https://www.sitepoint.com/using-node-mysql-javascript-client/
// https://hashnode.com/post/how-can-use-react-js-node-js-mysql-together-cjdlfbukh01vqn9wuaucmng6h
// https://stackoverflow.com/questions/50118028/post-form-data-to-mysql-using-node-js
var express = require('express');
	var app = express();
var bodyParser = require('body-parser');
	var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require('mysql');
// var ip = require('ip');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

var connection = mysql.createConnection({
	host: 'biosoda.cloudlab.zhaw.ch',
	user: 'biosoda_logger',
	password: 'biolog23090392',
	database: 'biosoda_logger'
});

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'biosoda_logger',
	password: 'biolog23090392',
	database: 'biosoda_logger'
});

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'biosoda',
	password: '***',
	database: 'biosoda_logger'
});

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
	res.header("Access-Control-Max-Age", '86400'); // 24 hours
	next();
});

app.get('/', function (req, res) {
	res.send('we don\'t do business here');
});

app.post('/', urlencodedParser, function (req, res) {
	console.log(req.body);
	var newlog = {fromip: req.ip, goal: req.body.goal, name: req.body.name, query: req.body.query, timetaken: req.body.timetaken };
	connection.query('INSERT INTO logs SET ?', newlog, (err, res) => {
		if(err) throw err;
		console.log('Last insert ID:', res.insertId);
	});
	res.send('logs received');
});

app.listen(3002, function () {
	console.log('Listening on port 3002');
});