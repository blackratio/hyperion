(function() {

   'use strict';

   angular.module('conf', [
      'initRouter',
      'utilities'
   ]);

   angular.module('home', [
      'homeWelcome'
   ]);

   angular.module('hyperion', [
      'conf',
      'home',
      'utilities',
      'ngStorage',
   ]);

})();
