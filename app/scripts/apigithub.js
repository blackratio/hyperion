(function() {

   'use strict';

   angular
      .module('homeWelcome.service', [])
      .factory('githubApi', githubApiFunction);

   function githubApiFunction($q, $http) {
      return {
         'getUser': function() {
            return $http.get('https://api.github.com/users/blackratio')
            .then(function(response) {
               return response.data;
            }).catch(function() {
               console.log('No response');
            });
         }
      };
   }

   githubApiFunction.$inject = ['$q', '$http'];

})();
