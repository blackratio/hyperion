(function() {

   'use strict';

   angular.module('conf', [
      'initRouter',
      'initRun',
      'utilities'
   ]);

   angular.module('home', [
      'homeWelcome',
      'homeWelcome.router'
   ]);

   angular.module('hyperion', [
      'conf',
      'home',
      'ngStorage',
   ]);

})();
