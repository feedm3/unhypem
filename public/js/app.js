(function(){



var app = angular.module('unhypemApp', []);

app.service('sharedProperties', function () {
    var currentSong = {
        artist: "",
        title: "",
        s_url: "",
        stream: "",
        h_mediaid: ""
    };
    var player = new Player();
    player.init();

    this.getCurrentSong = function () {
        return currentSong;
    };
    this.setCurrentSong = function (value) {
        currentSong.artist = value.artist;
        currentSong.title = value.title;
        currentSong.s_url = value.s_url;
        currentSong.stream = value.stream;
        currentSong.h_mediaid = value.h_mediaid;
    };
    this.preloadSongs = function (value) {
        player.preloadSong(_.pluck(value, "song"));
    };
    this.play = function (value) {
        player.play(value);
    };
});

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

app.controller('PlayerController', ['$scope', 'sharedProperties', function ($scope, sharedProperties) {
    var playerCtrl = this;
    $scope.currentSong = sharedProperties.getCurrentSong();

    playerCtrl.play = function () {
        sharedProperties.play($scope.currentSong.h_mediaid);
    }
}]);

app.directive('welcomeHeader', function () {
    return {
        restrict: 'E', //Element (HTML)
        templateUrl: 'welcome-header.html'
    };
});

app.directive('songTable', function () {
    return {
        restrict: 'E', //Element (HTML)
        templateUrl: 'song-table.html',
        controller: 'SongController',
        controllerAs: 'songCtrl'
    };
});

app.directive('player', function () {
    return {
        restrict: 'E', //Element (HTML)
        templateUrl: 'player.html',
        controller: 'PlayerController',
        controllerAs: 'playerCtrl'
    };
});

})();
