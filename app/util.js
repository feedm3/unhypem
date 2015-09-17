/**
 * @author Fabian Dietenberger
 */

'use strict';

var _ = require('lodash');

exports.isSoundcloudUrl = function (url) {
    if (url === null ||
        url === undefined) {
        return false;
    }
    if (url === "http://soundcloud.com/not/found" ||
        url === "https://soundcloud.com/not/found") {
        return false;
    }
    if (url !== _.startsWith(url, "http://soundcloud.com" ||
        url !== _.startsWith(url, "https://soundcloud.com")) ) {
        return false;
    }
    return true;
};
 
