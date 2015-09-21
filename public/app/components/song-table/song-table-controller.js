/**
 * @author Fabian Dietenberger
 */

'use strict';

(function () {
    angular.module('unhypemApp')
        .controller('SongController',  ['$scope', '$timeout', 'playerService', 'Songs', function ($scope, $timeout, playerService, Songs) {
            $scope.songs = [];
            $scope.selectedPosition = 0;
            $scope.dateMessage = "";
            $scope.dateTime = "";

            $scope.onClickSelectPosition = function (selectedPosition, $event) {
                if(!isSoundcloudLogoClicked($event)) { // TODO maybe use better methods like setNextSongAndPlay() and setNextSong() and setPreviousSong()
                    $scope.setSelectedPosition(selectedPosition);
                    var selectedId = $scope.songs[$scope.selectedPosition].hypemMediaId;
                    playerService.play(selectedId);
                }
            };

            $scope.setSelectedPosition = function (selectedPosition) {
                var selectedId = $scope.songs[selectedPosition].hypemMediaId;
                if (playerService.hasId(selectedId)) {
                    $scope.selectedPosition = selectedPosition;
                    playerService.setCurrentSong($scope.songs[selectedPosition]);
                } else {
                    $scope.setSelectedPosition(selectedPosition + 1);
                }
            };

            $scope.isSelected = function (selectedPosition) {
                return $scope.selectedPosition === selectedPosition;
            };

            $scope.hasStreamUrl = function (song) {
                return (typeof song.streamUrl === "string" && song.streamUrl.length > 0);
            };

            $scope.hasSoundcloudUrl = function (soundcloudUrl) {
                return (typeof soundcloudUrl === "string" && soundcloudUrl.length > 0);
            };

            $scope.setDate = function(date){
                var dateInMillis = new Date(date).getTime();
                var formattedTimeDifference =  moment(dateInMillis).fromNow();
                var formattedDateTime = moment(dateInMillis).format('Do MMM YYYY, HH:mm:ss');
                $scope.dateMessage = formattedTimeDifference;
                $scope.dateTime = formattedDateTime;
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
                    $scope.setDate(headers("timestamp"));
                    playerService.preloadSongs($scope.songs);
                    $scope.setSelectedPosition(0);
                });
        }]);

    function isSoundcloudLogoClicked(event) {
        if (event !== undefined && event !== null) {
            return event.target.className === "soundcloud-logo";
        }
        return false;
    }
})();