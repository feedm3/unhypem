(function(){
    angular.module('unhypemApp')
        .factory('Songs', ['$http', function SongsFactory($http){
            return {
                popular: function() {
                    return $http.get("/popular");
                }
            }
        }]);
})();
