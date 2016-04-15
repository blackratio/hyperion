(function() {

   var services = angular.module('services', []);
   var controllers = angular.module('controllers', []);
   var directives = angular.module('directives', []);
   var lodash = angular.module('lodash', []);
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
      'services',
      'controllers',
      'directives',
      'lodash',
      'ngStorage',
   ]);

   hyperion.run(['$rootScope', '$state', '$stateParams',
      function($rootScope, $state, $stateParams) {

         $rootScope.$state = $state;
         $rootScope.$stateParams = $stateParams;

      }
   ]);

})();
