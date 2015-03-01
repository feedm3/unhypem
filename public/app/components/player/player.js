(function () {
    var app = angular.module('player', []);

    app.controller('PlayerController', ['$scope', 'sharedProperties', function ($scope, sharedProperties) {
        $scope.currentSong = sharedProperties.getCurrentSong();
        $scope.progressValue = 0;

        $scope.play = function () {
            sharedProperties.play($scope.currentSong.hypemMediaId);
        };

        $scope.showValue = function (event) {
            var width = document.getElementById('progressbar').offsetWidth;
            var offset = event.layerX;
            var progress = 100 / width * offset;

        };

        sharedProperties.setProgressCallback(function (percent) {
            $scope.$apply(function () {
                $scope.progressValue = percent;
            });
        })
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