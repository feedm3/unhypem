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
var moment = require('moment');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    'timestamp': function () {
        return moment().format('dd, DD MMM YYYY - HH:mm:ss:SSS');
    },
    'level': 'info',
    'colorize':true
});

winston.info('Logger configured');

module.exports = winston;