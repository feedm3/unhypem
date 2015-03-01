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
                $scope.progressInSeconds = secondFormatter(seconds);
                if ($scope.durationInSeconds != 0) {
                    $scope.progressInPercent = 100 / $scope.durationInSeconds * seconds;
                }
            });
        });

        sharedProperties.setDurationCallback(function (seconds) {
            $scope.durationInSeconds = secondFormatter(seconds);
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

    /**
     * Converts seconds to mm:ss.
     *
     * @param second
     * @returns {string} mm:ss
     */
    function secondFormatter (second) {
        var sec_num = parseInt(second, 10); // don't forget the second param
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        return minutes+':'+seconds;
    }
})();