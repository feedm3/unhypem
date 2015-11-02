'use strict';

require('dotenv').load();
require('./app/config/log'); // configure logger

var express = require('express'),
    app = express(),
    logger = require('winston'),
    mongoose = require('mongoose'),
    lessMiddleware = require('less-middleware'),
    path = require('path'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    hypemService = require('./app/hypem/hypemService');

var popularRoute = require('./app/routes/popular'),
    songsRoute = require('./app/routes/songs');

app.use(morgan('dev')); // TODO put this in .env
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

hypemService.start();
//hypemService.startNow();

/**
 * Database setup
 */
mongoose.connect('mongodb://' + process.env.MONGOLAB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Could not connect to the database'));

/**
 * Routes
 */
app.use('/songs', songsRoute);
app.use('/popular', popularRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var requestedUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var err = new Error('Not Found - ' + requestedUrl);
    err.status = 404;
    next(err);
});

/**
 * Development error handler
 *
 * Will send the error object back to the user
 */
if (process.env.NODE_ENV === 'development') {
    app.use(function (err, req, res, next) {
        console.error(err.status + " " + err.message);
        res.status(err.status || 500);
        res.json(err);
    });
}

/**
 * Production error handler
 *
 * Will only send the status code back to the user
 */
app.use(function (err, req, res, next) {
    console.error(err.status + " " + err.message);
    res.sendStatus(err.status || 500);
});


module.exports = app;
