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

const winston = require('winston');
require('winston-loggly');
const moment = require('moment');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    'timestamp': function() {
        return moment().format('dd, DD MMM YYYY - HH:mm:ss:SSS');
    },
    'level': 'debug',
    'colorize': true,
    handleExceptions: true
});
if (process.env.LOGGLY_ENABLED === 'true') {
    console.log('Add loggly to the global logger');
    winston.add(winston.transports.Loggly, {
        token: '1c96a7e3-b77e-4fd2-b909-9cec22ad513d',
        subdomain: 'feedme',
        tags: ['Winston-NodeJS'],
        json: true
    });
}

module.exports = winston;
