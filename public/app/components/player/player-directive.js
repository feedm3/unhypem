/**
 * @author Fabian Dietenberger
 */

'use strict';

(function () {
    angular.module('unhypemApp')
        .directive('player', function () {
            return {
                restrict: 'E', //Element (HTML)
                templateUrl: '../app/components/player/player.html',
                controller: 'PlayerController'
            };
        });
})();