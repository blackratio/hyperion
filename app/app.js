(function () {

   'use strict';

   angular.module('conf', [
      'initRouter',
      'initRun',
      'utilities'
   ]);

   angular.module('home', [
      'homePage',
      'homePage.router'
   ]);

   angular.module('hyperion', [
      'conf',
      'home',
      'ngStorage',
   ]);

})();
