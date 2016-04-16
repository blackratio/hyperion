(function() {

   var utilities = angular.module('utilities', []);
   var home = angular.module('home', [
      'homeWelcome'
   ]);
   var conf = angular.module('conf', [
      'initRouter',
      'routeHome'
   ]);

   var hyperion = angular.module('hyperion', [
      'conf',
      'home',
      'utilities',
      'ngStorage',
   ]);

   hyperion.run(['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {

         $rootScope.$state = $state;
         $rootScope.$stateParams = $stateParams;

      }
   ]);

})();
