(function () {
    var app = angular.module('song-table', []);

    app.controller('SongController', ['$scope', '$http', 'sharedProperties', function ($scope, $http, sharedProperties) {
        var songCtrl = this;
        $scope.popularSongsList = {};
        $scope.selectedPosition = 1;
        $scope.date = new Date().getDate().toString();

        songCtrl.setSelectedPosition = function (selectedPosition) {
            $scope.selectedPosition = selectedPosition;
            sharedProperties.setCurrentSong($scope.popularSongsList[selectedPosition - 1]);
        };

        songCtrl.isSelected = function (selectedPosition) {
            return $scope.selectedPosition === selectedPosition;
        };

        songCtrl.hasSoundcloudUrl = function (soundcloudUrl) {
            return typeof soundcloudUrl == "string";
        };

        $http.get("/popular").
            success(function (popularList) {
                $scope.popularSongsList = popularList;
                sharedProperties.preloadSongs(popularList);
                songCtrl.setSelectedPosition(1);
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