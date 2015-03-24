(function(){
    angular.module('unhypemApp')
        .directive('navigationBar', function () {
            return {
                restrict: 'E', //Element (HTML)
                templateUrl: '../app/components/navigation/navigation-bar.html'
            };
    });
})();