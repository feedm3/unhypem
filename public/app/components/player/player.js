(function () {
    var app = angular.module('player', []);
    app.controller('PlayerController', ['$scope', 'sharedProperties', function ($scope, sharedProperties) {
        var playerCtrl = this;
        $scope.currentSong = sharedProperties.getCurrentSong();

        playerCtrl.play = function () {
            sharedProperties.play($scope.currentSong.h_mediaid);
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