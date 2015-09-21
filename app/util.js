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
    if (url === "https://soundcloud.com/not/found" ||
        url === "http://soundcloud.com/not/found") {
        return false;
    }
    if (_.startsWith(url, "https://soundcloud.com") ||
        _.startsWith(url, "http://soundcloud.com")) {
        return true;
    }
    return false;
};
 
