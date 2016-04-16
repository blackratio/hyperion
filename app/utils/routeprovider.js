(function() {

   angular
      .module('initRouter', [
         'ui.router'
      ])
      .config(initProvider);

      ///////

   function initProvider($urlRouterProvider, $compileProvider, $logProvider) {

      // Pour toute route inapproprié
      $urlRouterProvider.otherwise('/');

      // Enable/disable Angular Debug Mod
      $compileProvider.debugInfoEnabled(false);
      $logProvider.debugEnabled(true);

   }

   initProvider.$inject = ['$urlRouterProvider', '$compileProvider', '$logProvider'];

})();
