(function () {
    angular.module('unhypemApp')
        .controller('SongController',  ['$scope', '$timeout', 'playerService', 'Songs', function ($scope, $timeout, playerService, Songs) {
            $scope.songs = [];
            $scope.selectedPosition = 0;
            $scope.date = "";

            $scope.onClickSelectPosition = function (selectedPosition, $event) {
                if(!isSoundcloudHtmlNode($event.target.className)) {
                    $scope.setSelectedPosition(selectedPosition);
                    playerService.play($scope.songs[selectedPosition].hypemMediaId);
                }
            };

            $scope.setSelectedPosition = function (selectedPosition) {
                $scope.selectedPosition = selectedPosition;
                playerService.setCurrentSong($scope.songs[selectedPosition]);
            };

            $scope.isSelected = function (selectedPosition) {
                return $scope.selectedPosition === selectedPosition;
            };

            $scope.hasStreamUrl = function (song) {
                return (typeof song.streamUrl == "string" && song.streamUrl.length > 0)
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

            Songs.popular()
                .success(function (songs, status, headers, config) {
                    $scope.songs = _.values(songs); // TODO reihenfolge nicht sichergestellt
                    $scope.date = headers("timestamp");
                    playerService.preloadSongs($scope.songs);
                    $scope.setSelectedPosition(0);
                });
        }]);

    function isSoundcloudHtmlNode(className) {
        return className === "soundcloud-logo"
    }
})();