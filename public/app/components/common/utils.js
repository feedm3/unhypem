/**
 * @author Fabian Dietenberger
 */

'use strict';

const Utils = {

    /**
     * Get the scrollTop position of the browser. This works on FF, Chrome and Edge.
     *
     * @returns {number}
     */
    getScrollTop() {
        // the || operator will return the 'not 0' value
        return document.documentElement.scrollTop || document.body.scrollTop;
    },

    /**
     * Set the scrollTop position of the browser. This works on FF, Chrome and Edge.
     *
     * @param value
     */
    setScrollTop(value) {
        document.documentElement.scrollTop = value; // ff
        document.body.scrollTop = value; // chrome and edge
    }
};

export default Utils;
