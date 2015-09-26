/**
 * @author Fabian Dietenberger
 */

'use strict';

var url = require('url');

exports.isSoundcloudUrl = function (link) {
    if (link === null ||
        link === undefined ||
        typeof link !== 'string') {
        return false;
    }
    if (link === "https://soundcloud.com/not/found" ||
        link === "http://soundcloud.com/not/found") {
        return false;
    }
    var hostName = url.parse(link).hostname;
    return hostName === "soundcloud.com";
};
 
