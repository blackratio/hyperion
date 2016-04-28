(function() {

   'use strict';

   angular
      .module('homePage.router', [
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
                  controller: 'homeController as homeVm'
               }
            },
            data: {
               mainSection: 'framework',
               windowTitle: 'Hyperion, Modular SASS/CSS Framework',
               section: 'home'
            }
         });
   }

   configProvider.$inject = ['$stateProvider'];

})();
