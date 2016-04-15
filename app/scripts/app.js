var services = angular.module('services', []);
var controllers = angular.module('controllers', []);
var directives = angular.module('directives', []);
var lodash = angular.module('lodash', []);


var sandbox = angular.module('sandbox', [
   'services',
   'controllers',
   'directives',
   'ui.router',
   'lodash',
   'ngStorage',
   'leaflet-directive'
]);

sandbox.config(['$stateProvider', '$provide', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$compileProvider', '$logProvider',
   function($stateProvider, $provide, $urlRouterProvider, $httpProvider, $locationProvider, $compileProvider, $logProvider) {
      "use strict";

      // Pour toute route inapproprié
      $urlRouterProvider.otherwise('/');

      // Active le mode HTML5, pas de # dans l'URL
      //$locationProvider.html5Mode(true);

      //$httpProvider.interceptors.push('interceptor');

      // Token interceptor
      //$httpProvider.interceptors.push('TokenInterceptor');


      // Enable/disable Angular Debug Mod
      $compileProvider.debugInfoEnabled(false);
      $logProvider.debugEnabled(true);

      $stateProvider

         .state('home', {
            url: '/',
            views: {
               'main_content': {
                  templateUrl: 'partials/index.html',
                  controller: 'homeController'
               }
            },
            data: {
               mainSection: 'framework',
               pageTitle: 'Welcome - SANDBOX',
               section: 'home'
            }
         })
         .state('objectchange', {
            url: '/objectchange',
            views: {
               'main_content': {
                  templateUrl: 'partials/deepmap.html',
                  controller: 'objectController',
                  controllerAs: 'myCtrl'
               }
            },
            data: {
               mainSection: 'framework',
               pageTitle: 'Welcome - SANDBOX - Work with objects & map',
               section: 'Play with object'
            }
         })
         .state('network', {
            url: '/d3network',
            views: {
               'main_content': {
                  templateUrl: 'partials/network.html',
                  controller: 'networkController',
                  controllerAs: 'myNetworkCtrl'
               }
            },
            data: {
               mainSection: 'framework',
               pageTitle: 'Welcome - SANDBOX - network with d3 js',
               section: 'Play with bubble'
            }
         });

   }
]);


sandbox.run(['$rootScope', '$state', '$stateParams',
   function($rootScope, $state, $stateParams) {

      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

   }
]);
