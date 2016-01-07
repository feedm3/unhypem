'use strict';

require('dotenv').load();
require('./app/config/log'); // configure logger

import express from 'express';

const app = express();
const lessMiddleware = require('less-middleware');
const favicon = require('serve-favicon');
const path = require('path');
const logger = require('winston');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const hypemService = require('./app/hypem/hypem-service');
const databaseManager = require('./app/hypem/database-manager');
const popularRoute = require('./app/routes/popular');
const songsRoute = require('./app/routes/songs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Database setup
 */
import db from './app/config/db';
const migration = require('./app/config/migration');
migration.up(db.knex).then(function() {
    logger.info('Database is ready to use');
    hypemService.start();
    databaseManager.deleteChartsHistoryEveryHour();
}).catch(function(err) {
    logger.error('No connection to database or error creating tables. ' + err);
});

/**
 * Routes
 */
app.use('/songs', songsRoute);
app.use('/popular', popularRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const requestedUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const err = new Error('Not Found - ' + requestedUrl);
    err.status = 404;
    next(err);
});

/**
 * Development error handler
 *
 * Will send the error object back to the user
 */
if (process.env.NODE_ENV === 'development') {
    app.use(function(err, req, res, next) {
        logger.error(err.status + ' ' + err.message);
        res.status(err.status || 500);
        res.json(err);
    });
}

/**
 * Production error handler
 *
 * Will only send the status code back to the user
 */
app.use(function(err, req, res, next) {
    logger.error(err.status + ' ' + err.message);
    res.sendStatus(err.status || 500);
});

module.exports = app;
