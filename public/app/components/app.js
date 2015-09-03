/**
 * @author Fabian Dietenberger
 */

'use strict';

(function(){
    // only new module must be injected as dependency
    angular.module('unhypemApp', ['player-service', 'ui.bootstrap', 'ngRoute'])
        .config(['$routeProvider', function($routeProvider){
            $routeProvider
                .when('/', {
                    templateUrl: 'app/components/song-table/song-table.html',
                    controller: 'SongController'
                })
                .when('/imprint', {
                    templateUrl: 'app/components/imprint/imprint.html'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);
})();
