(function() {

   'use strict';

   angular
      .module('homeWelcome.service', [])
      .factory('homeFactoryRequest', homeFactoryRequestFunction);

   homeFactoryRequestFunction.$inject = ['$http'];

   ////////

   function homeFactoryRequestFunction($http) {
      return {
         gitHub: function() {
            const url = 'https://api.github.com/users/';
            const user = 'blackratio';
            return $http.get(url+user)
            .then(function(response) {
               return response.data;
            }).catch(function() {
               console.log('Problem :/');
            });
         }
      };
   }

})();
