/**
 * @author Fabian Dietenberger
 */

'use strict';

import url from 'url';

exports.isSoundcloudUrl = function(link) {
    if (link === null ||
        link === undefined ||
        typeof link !== 'string') {
        return false;
    }
    if (link === 'https://soundcloud.com/not/found' ||
        link === 'http://soundcloud.com/not/found') {
        return false;
    }
    const hostName = url.parse(link).hostname;
    if (hostName === 'soundcloud.com' ||
        hostName === 'api.soundcloud.com') {
        return true;
    }
    return false;
};
