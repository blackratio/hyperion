(function() {

   'use strict';

   angular
      .module('homeWelcome.router', [
         'ui.router'
      ])
      .config(configProvider);

   ///////

   function configProvider($stateProvider) {
      $stateProvider
         .state('home', {
            url: '/',
            views: {
               'main_content': {
                  templateUrl: 'modules/home/home.html',
                  controller: 'homeController'
               }
            },
            data: {
               mainSection: 'framework',
               windowTitle: 'Hyperion, the modular CSS framework',
               section: 'home'
            }
         });
   }

   configProvider.$inject = ['$stateProvider'];

})();
