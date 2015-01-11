(function () {
    var app = angular.module('song-table', []);

    app.controller('SongController', ['$scope', '$http', 'sharedProperties', function ($scope, $http, sharedProperties) {
        var songCtrl = this;
        $scope.popularSongs = [];
        $scope.selectedPosition = 1;
        $scope.date = new Date().getDate().toString();

        songCtrl.setSelectedPosition = function (selectedPosition) {
            $scope.selectedPosition = selectedPosition;
            sharedProperties.setCurrentSong($scope.popularSongs[selectedPosition - 1].song);
        };

        songCtrl.isSelected = function (selectedPosition) {
            return $scope.selectedPosition === selectedPosition;
        };

        songCtrl.hasSoundcloudUrl = function (soundcloudUrl) {
            return typeof soundcloudUrl == "string";
        };

        $http.get("/popular").
            success(function (popularSongs) {
                $scope.popularSongs = popularSongs;
                sharedProperties.preloadSongs(popularSongs);
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