var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    logger = require('winston'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    hypemService = require('./app/database/hypemService');

var indexRoute = require('./routes/index'),
    popularRoute = require('./routes/popular');

require('./app/config/newrelic');

var app = express();

app.use(morgan('dev')); // TODO put this in .env
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

hypemService.start();

app.use('/', indexRoute);
app.use('/popular', popularRoute);
app.get('/song/:hypemId', function(req, res){
    var hypemId = req.params.hypemId.toLowerCase();
    res.send("You want to have song information to " + hypemId);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        logger.error(err.message, err);
        res.sendStatus(err.status || 500);
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    logger.error(err.message, err);
    res.sendStatus(err.status || 500);
});


module.exports = app;
