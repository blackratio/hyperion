(function(){

'use strict';

   angular.module('utilities', []);

   angular
      .module('utilities')
      .factory('_', lodashWindow);

      function lodashWindow($window){
         return $window._;
      }

      lodashWindow.$inject = ['window'];

   angular
      .module('utilities')
      .factory('moment', momentWindow);

      function momentWindow($window){
         return $window.moment;
      }

      momentWindow.$inject = ['window'];

})();
