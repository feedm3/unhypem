/**
 * @author Fabian Dietenberger
 */

'use strict';

import bookshelf from '../config/db';

const SongsModel = bookshelf.Model.extend({
    tableName: 'songs',
    charts: function() {
        return this.belongsToMany('Charts');
    }
});

bookshelf.model('Songs', SongsModel);
export default SongsModel;
