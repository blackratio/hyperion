(function(){

   'use strict';

   angular
      .module('conf', [
         'conf.service'
      ])
      .run(initRun);

   ////////

   function initRun ($rootScope, $state, $stateParams, $httpProvider) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
      //$httpProvider.interceptors.push('myHttpInterceptor');
   }

   initRun.$inject = ['$rootScope', '$state', '$stateParams', '$httpProvider'];

})();
