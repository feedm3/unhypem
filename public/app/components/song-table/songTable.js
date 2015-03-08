(function () {
    var app = angular.module('song-table', []);

    app.controller('SongController', ['$scope', '$http', 'sharedProperties', function ($scope, $http, sharedProperties) {
        $scope.songs = [];
        $scope.selectedPosition = 1;
        $scope.date = "";
        $scope.firstVisit = true;

        $scope.setSelectedPosition = function (selectedPosition) {
            $scope.selectedPosition = selectedPosition;
            sharedProperties.setCurrentSong($scope.songs[selectedPosition]);

            if ($scope.firstVisit) {
                $scope.firstVisit = false;
                return;
            }

            sharedProperties.play($scope.songs[selectedPosition].hypemMediaId)
        };

        $scope.isSelected = function (selectedPosition) {
            return $scope.selectedPosition === selectedPosition;
        };

        $scope.hasSoundcloudUrl = function (soundcloudUrl) {
            return (typeof soundcloudUrl == "string" && soundcloudUrl.length > 0)
        };

        $http.get("/popular").
            success(function (songs, status, headers, config) {
                $scope.songs = _.values(songs); // TODO reihenfolge nicht sichergestzellt
                $scope.date = headers("timestamp");

                sharedProperties.preloadSongs($scope.songs);
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