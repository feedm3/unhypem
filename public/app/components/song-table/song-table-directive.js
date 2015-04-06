(function(){
    angular.module('unhypemApp')
        .directive('songTable', function () {
            return {
                restrict: 'E', //Element (HTML)
                templateUrl: '../app/components/song-table/song-table.html',
                controller: 'SongController'
            };
        });
})();