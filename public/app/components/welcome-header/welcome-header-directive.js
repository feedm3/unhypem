(function () {
    angular.module('unhypemApp')
        .directive('welcomeHeader', function () {
            return {
                restrict: 'E', //Element (HTML)
                templateUrl: '../app/components/welcome-header/welcome-header.html'
            };
        });
})();