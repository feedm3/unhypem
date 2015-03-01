(function () {
    var app = angular.module('player', []);

    app.controller('PlayerController', ['$scope', 'sharedProperties', function ($scope, sharedProperties) {
        $scope.currentSong = sharedProperties.getCurrentSong();

        $scope.volumeInPercent = 100;
        $scope.progressInPercent = 0;
        $scope.progressInSeconds = 0;
        $scope.durationInSeconds = 0;

        $scope.play = function () {
            sharedProperties.play($scope.currentSong.hypemMediaId);
        };

        $scope.onProgressbarClick = function (event) {
            var width = document.getElementById('progressbar').offsetWidth;
            var offset = event.layerX;
            $scope.progressInPercent = 100 / width * offset;
            sharedProperties.setProgress($scope.progressInPercent);
        };

        $scope.onVolumebarClick = function (event) {
            var width = document.getElementById('volumebar').offsetWidth;
            var offset = event.layerX;
            $scope.volumeInPercent = 100 / width * offset;
            sharedProperties.setVolume($scope.volumeInPercent);
        };

        sharedProperties.setProgressCallback(function (seconds) {
            $scope.$apply(function () {
                $scope.progressInSeconds = Math.floor(seconds);
                if ($scope.durationInSeconds != 0) {
                    $scope.progressInPercent = 100 / $scope.durationInSeconds * seconds;
                }
            });
        });

        sharedProperties.setDurationCallback(function (seconds) {
            $scope.durationInSeconds = seconds;
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