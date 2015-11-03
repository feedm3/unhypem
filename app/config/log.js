/**
 * This file is used to configure and setup winston.
 *
 * Logging levels: https://github.com/winstonjs/winston#logging-levels
 *  0 error
 *  1 warn
 *  2 info
 *  3 verbose
 *  4 debug
 *  5 silly
 *
 * @type {exports|module.exports}
 */

'use strict';

var winston = require('winston');
require('winston-loggly');
var moment = require('moment');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    'timestamp': function () {
        return moment().format('dd, DD MMM YYYY - HH:mm:ss:SSS');
    },
    'level': 'info',
    'colorize': true,
    handleExceptions: true
});
winston.add(winston.transports.Loggly, {
    token: "1c96a7e3-b77e-4fd2-b909-9cec22ad513d",
    subdomain: "feedme",
    tags: ["Winston-NodeJS"],
    json:true
});

winston.info('Logger configured');

module.exports = winston;