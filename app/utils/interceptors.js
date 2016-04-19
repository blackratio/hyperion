(function() {

   'use strict';

   angular
      .module('conf.interceptors', [])
      .factory('myHttpInterceptor', myHttpInterceptorFunction);

   function myHttpInterceptorFunction($q) {
      return {
         'request': function(config) {
            return config;
         },
         'requestError': function(rejection) {
            return $q.reject(rejection);
         },
         'response': function(response) {
            return response;
         },
         'responseError': function(rejection) {
            return $q.reject(rejection);
         }
      };
   }

   myHttpInterceptorFunction.$inject = ['$q'];

})();
