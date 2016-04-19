(function() {

'use strict';

   angular
      .module('initRouter', [
         'ui.router',
         'conf.interceptors'
      ])
      .config(initProvider);

   ///////

   function initProvider($urlRouterProvider, $compileProvider, $logProvider, $httpProvider) {

      // Pour toute route inapproprié
      $urlRouterProvider.otherwise('/');

      // Enable/disable Angular Debug Mod
      $compileProvider.debugInfoEnabled(false);

      $logProvider.debugEnabled(true);

      $httpProvider.interceptors.push('myHttpInterceptor');

   }

   initProvider.$inject = ['$urlRouterProvider', '$compileProvider', '$logProvider', '$httpProvider'];

})();
