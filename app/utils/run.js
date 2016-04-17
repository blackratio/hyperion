(function(){

   'use strict';

   angular
      .module('conf')
      .run(initRun);

   ////////

   function initRun ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
   }

   initRun.$inject = ['$rootScope', '$state', '$stateParams'];

})();
