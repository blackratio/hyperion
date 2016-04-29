(function () {

   'use strict';

   angular
      .module('homePage.factory', [])
      .factory('homeFactory', homeFactory);

   homeFactory.$inject = ['$http'];

   ////////

   function homeFactory($http) {
      return {
         gitHub: function () {
            const url = 'https://api.github.com/users/';
            const user = 'blackratio';
            return $http.get(url + user)
               .then(function (response) {
                  return response.data;
               }).catch(function () {
                  console.log('Problem :/');
               });
         },
         frameworkContent: function () {
            return $http.get('datas/app.json')
               .then(function (response) {
                  return response.data;
               }).catch(function () {
                  console.log('Problem :/');
               });
         }
      };
   }

})();
