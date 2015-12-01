/**
 * @author Fabian Dietenberger
 */

'use strict';

var bookshelf = require('../config/db');

var SongsModel = bookshelf.Model.extend({
    tableName: 'songs',
    charts: function() {
        return this.belongsToMany('Charts');
    }
});

/**
 * Export model and register to bookshelf
 */
module.exports = bookshelf.model('Songs', SongsModel);