(function(){
    var app = angular.module('navigation-bar', []);

    app.directive('navigationBar', function () {
        return {
            restrict: 'E', //Element (HTML)
            templateUrl: 'app/components/navigation/navigation-bar.html'
        };
    });
})();