/**
 * @author Fabian Dietenberger
 */

'use strict';

import bookshelf from '../config/db';

var ChartsModel = bookshelf.Model.extend({
    tableName: 'charts',
    songs: function() {
        return this.belongsToMany('Songs').withPivot(['position']);
    },

    /**
     * Get the latest chart
     */
    latest: function () {
        return this.query(function (queryBuilder) {
            queryBuilder.orderBy('timestamp', 'DESC').limit(1);
        });
    }
});

bookshelf.model('Charts', ChartsModel);
export default ChartsModel;