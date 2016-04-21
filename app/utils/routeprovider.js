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
        $urlRouterProvider.otherwise('/');
        $compileProvider.debugInfoEnabled(false);
        $logProvider.debugEnabled(true);
        $httpProvider.interceptors.push('myHttpInterceptor');
    }

    initProvider.$inject = ['$urlRouterProvider', '$compileProvider', '$logProvider', '$httpProvider'];

})();
