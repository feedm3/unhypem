(function () {
    angular.module('unhypemApp')
        .directive('imprint', function () {
            return {
                restrict: 'E',
                templateUrl: '../app/components/imprint/imprint.html'
            };
        });
})();