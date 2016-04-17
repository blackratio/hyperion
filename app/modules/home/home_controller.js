(function() {

   'use strict';

   angular
      .module('homeWelcome')
      .controller('homeController', homeIndex);

   ////////

   function homeIndex($scope) {
      $scope.homeContent = {
         title: 'Welcome to Hyperion Home',
         subtitle: 'The modular Css Framework'
      };
   }

   homeIndex.$inject = ['$scope'];

})();
