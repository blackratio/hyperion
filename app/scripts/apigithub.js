(function() {
    'use strict';

    angular
        .module('homeWelcome.service', [])
        .factory('githubApi', githubApiFunction);

    function githubApiFunction($q, $http) {
        return {
            // optional method
            'getUser': function() {

                var defer = $q.defer();

                $http.get('https://api.github.com/users/blackratio').then(function(response) {
                  defer.resolve(response.data);
                }, function(response) {
                  defer.reject(response);
                });

                return defer.promise;
            }
        };
    }

    githubApiFunction.$inject = ['$q', '$http'];

})();
