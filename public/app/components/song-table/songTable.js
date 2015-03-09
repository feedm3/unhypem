(function () {
    var app = angular.module('song-table', []);

    app.controller('SongController', ['$scope', '$http', '$timeout', 'playerService', function ($scope, $http, $timeout, playerService) {
        $scope.songs = [];
        $scope.selectedPosition = 0;
        $scope.date = "";

        $scope.onClickSelectPosition = function (selectedPosition) {
            $scope.setSelectedPosition(selectedPosition);
            playerService.play($scope.songs[selectedPosition].hypemMediaId);
        };

        $scope.setSelectedPosition = function (selectedPosition) {
            $scope.selectedPosition = selectedPosition;
            playerService.setCurrentSong($scope.songs[selectedPosition]);
        };

        $scope.isSelected = function (selectedPosition) {
            return $scope.selectedPosition === selectedPosition;
        };

        $scope.hasSoundcloudUrl = function (soundcloudUrl) {
            return (typeof soundcloudUrl == "string" && soundcloudUrl.length > 0)
        };

        playerService.setOnFinishCallback(function () {
            if ($scope.selectedPosition < 49) {
                $scope.onClickSelectPosition($scope.selectedPosition + 1);
            } else {
                $scope.onClickSelectPosition(0);
            }
        });

        playerService.setOnForwardCallback(function () {
            // make call async because of 'apply' inside the function
            $timeout(function() {
                playerService.setProgress(0);
            }, 0);

            if ($scope.selectedPosition < 49) {
                if (playerService.isPlaying()) {
                    $scope.onClickSelectPosition($scope.selectedPosition + 1);
                } else {
                    $scope.setSelectedPosition($scope.selectedPosition + 1);
                }
            } else {
                if (playerService.isPlaying()) {
                    $scope.onClickSelectPosition(0);
                } else {
                    $scope.setSelectedPosition(0);
                }
            }
        });

        playerService.setOnRewindCallback(function () {
            // make call async because of 'apply' inside the function
            $timeout(function() {
                playerService.setProgress(0);
            }, 0);

            if (playerService.getProgressInSeconds() < 3) {
                if ($scope.selectedPosition > 1) {
                    if (playerService.isPlaying()) {
                        $scope.onClickSelectPosition($scope.selectedPosition - 1);
                    } else {
                        $scope.setSelectedPosition($scope.selectedPosition - 1);
                    }
                } else {
                    if (playerService.isPlaying()) {
                        $scope.onClickSelectPosition(49);
                    } else {
                        $scope.setSelectedPosition(49);
                    }
                }
            }
        });

        $http.get("/popular").
            success(function (songs, status, headers, config) {
                $scope.songs = _.values(songs); // TODO reihenfolge nicht sichergestzellt
                $scope.date = headers("timestamp");

                playerService.preloadSongs($scope.songs);
                $scope.setSelectedPosition(0);
            });
    }]);

    app.directive('songTable', function () {
        return {
            restrict: 'E', //Element (HTML)
            templateUrl: 'app/components/song-table/song-table.html',
            controller: 'SongController',
            controllerAs: 'songCtrl'
        };
    });
})();