(function() {
    'use strict';

    angular
        .module('homeWelcome.service', [])
        .factory('githubApi', githubApiFunction);

    function githubApiFunction($q, $http) {
        return {
            // optional method
            'getUser': function() {


               return $http.get('https://api.github.com/users/blackratio').then(function(response) {
               return response.data;
             });
            }
        };
    }

    githubApiFunction.$inject = ['$q', '$http'];

})();
