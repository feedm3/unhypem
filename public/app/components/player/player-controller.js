/**
 * @author Fabian Dietenberger
 */

'use strict';

(function () {
    angular.module('unhypemApp')
        .controller('PlayerController', ['$scope', '$timeout', 'playerService', function ($scope, $timeout, playerService) {
            $scope.currentSong = playerService.getCurrentSong();
            $scope.volumeInPercent = 100;
            $scope.progress = '00:00';
            $scope.progressInPercent = 0;
            $scope.duration = '00:00';
            $scope.durationInSeconds = 0;
            $scope.isPlaying = false;


            $scope.$watch('currentSong', function () {
                $scope.progressInPercent = 0;
                $scope.waveformStyle = {
                    'background-image': 'url(' + $scope.currentSong.waveformUrl + ')'
                };
                $scope.hypemLink = "http://hypem.com/track/" + $scope.currentSong.hypemMediaId;
                $scope.soundcloudLink = $scope.currentSong.soundcloudUrl;
            }, true);

            $scope.play = function () {
                playerService.play($scope.currentSong.hypemMediaId);
            };

            $scope.forward = function () {
                playerService.forward();
            };

            $scope.rewind = function () {
                playerService.rewind();
            };

            $scope.onProgressbarClick = function (event) {
                var width = document.getElementById('progressbar').offsetWidth;
                var offset = event.layerX;
                $scope.progressInPercent = 100 / width * offset;

                // make call async because of 'apply' inside the function
                $timeout(function() {
                    playerService.setProgress($scope.progressInPercent);
                }, 0);
            };

            $scope.onVolumebarClick = function (event) {
                var width = document.getElementById('volumebar').offsetWidth; // TODO fdi geht nicht im IE10
                var offset = event.layerX;
                $scope.volumeInPercent = 100 / width * offset;
                playerService.setVolume($scope.volumeInPercent);
            };

            playerService.setProgressCallback(function (seconds) {
                $scope.$apply(function () {
                    $scope.progress = secondFormatter(seconds);
                    if ($scope.durationInSeconds != 0) {
                        $scope.progressInPercent = 100 / $scope.durationInSeconds * seconds;
                    }
                });
            });

            playerService.setDurationCallback(function (seconds) {
                $scope.durationInSeconds = seconds;
                $scope.duration = secondFormatter(seconds);
            });

            playerService.setOnPlayCallback(function () {
                $scope.isPlaying = true;
            });

            playerService.setOnPauseCallback(function () {
                $scope.isPlaying = false;
            });
        }]);

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