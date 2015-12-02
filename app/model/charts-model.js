/**
 * @author Fabian Dietenberger
 */

'use strict';

var bookshelf = require('../config/db');

var ChartsModel = bookshelf.Model.extend({
    tableName: 'charts',
    songs: function() {
        return this.belongsToMany('Songs').withPivot(['position']);
    },

    /**
     * Get the latest chart
     */
    latest: function () {
        return this.query(function (qb) {
            qb.orderBy('timestamp', 'DESC').limit(1);
        });
    }
});

/**
 * Export model and register to bookshelf
 */
module.exports = bookshelf.model('Charts', ChartsModel);