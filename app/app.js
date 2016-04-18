(function() {

   'use strict';

   angular.module('conf', [
      'initRouter',
      'utilities'
   ]);

   angular.module('home', [
      'homeWelcome',
      'homeWelcome.router'
   ]);

   angular.module('hyperion', [
      'conf',
      'home',
      'utilities',
      'ngStorage',
   ]);

})();
