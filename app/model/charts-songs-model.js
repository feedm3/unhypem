/**
 * @author Fabian Dietenberger
 */

'use strict';

import bookshelf from '../config/db';

const ChartsSongsModel = bookshelf.Model.extend({
    tableName: 'charts_songs',
    idAttribute: null
});

export default ChartsSongsModel;
