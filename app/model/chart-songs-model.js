/**
 * @author Fabian Dietenberger
 */

'use strict';

var bookshelf = require('../config/db');

var ChartsSongsModel = bookshelf.Model.extend({
    tableName: 'charts_songs',
    idAttribute: null
});

module.exports = ChartsSongsModel;
