(function(){
    // only new module must be injected as dependency
    angular.module('unhypemApp', ['player-service', 'ui.bootstrap']);
        //.config(['$routeProvider', function($routeProvider){
        //    $routeProvider
        //        .when('/', {
        //            templateUrl: 'popular.html',
        //            controller: 'PopularController',
        //            controllerAs: 'popularCtrl'
        //        })
        //        .when('/about', {
        //            templateUrl: 'about.html'
        //        })
        //        .when('imprint', {
        //            templateUrl: 'imprint.html'
        //        })
        //        .otherwise({
        //            redirectTo: '/'
        //        });
        //}]);
})();
