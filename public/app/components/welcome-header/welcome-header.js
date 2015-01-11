(function () {
    var app = angular.module('welcome-header', []);

    app.directive('welcomeHeader', function () {
        return {
            restrict: 'E', //Element (HTML)
            templateUrl: 'app/components/welcome-header/welcome-header.html'
        };
    });
})();