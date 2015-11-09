"use strict";

require('dotenv').load();

var express = require('express');
var mysql = require('mysql');
var app = express();
var outputString = "";

app.engine('html', require('ejs').renderFile);


app.locals.databasestring = process.env.MYSQL_STRING;
app.locals.connectionerror = 'successful';
app.locals.databases = '';

//[3] Connect to the Amazon RDS instance
var connection = mysql.createConnection(app.locals.databasestring);

connection.connect(function(err)
{
    if (err) {
        app.locals.connectionerror = err.stack;
        return;
    }
});

// [4] Query the database
connection.query('SHOW DATABASES', function (err, results) {
    if (err) {
        app.locals.databases = err.stack;
    }
    
    if (results) {
        for (var i in results) {
            outputString = outputString + results[i].Database + ', ';
        }
        app.locals.databases = outputString.slice(0, outputString.length-2);
    }
});

connection.end();
app.get('/', function(req, res) {
    res.send("ping");
});

app.get('/pong', function(req, res) {
    res.render('./index.html');
});

app.use(express.static('public'));

//[5] Listen for incoming requests
app.listen(process.env.PORT);
