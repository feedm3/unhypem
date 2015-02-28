(function () {
    var app = angular.module('player', []);

    app.controller('PlayerController', ['$scope', 'sharedProperties', function ($scope, sharedProperties) {
        $scope.currentSong = sharedProperties.getCurrentSong();

        $scope.play = function () {
            sharedProperties.play($scope.currentSong.hypemMediaId);
        }
    }]);

    app.directive('player', function () {
        return {
            restrict: 'E', //Element (HTML)
            templateUrl: 'app/components/player/player.html',
            controller: 'PlayerController',
            controllerAs: 'playerCtrl'
        };
    });
})();