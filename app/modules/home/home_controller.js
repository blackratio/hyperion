(function() {

   'use strict';

   angular
      .module('homeWelcome', [
         'homeWelcome.service'
      ])
      .controller('homeController', homeControllerFunction);

   homeControllerFunction.$inject = ['$scope', 'homeFactoryRequest'];

   ////////

   function homeControllerFunction($scope, homeFactoryRequest) {
      let homeTitle = {
         title: 'Hyperion',
         subtitle: 'Modular SASS/CSS Framework !'
      };
      $scope.homeContent = homeTitle;
      homeFactoryRequest.gitHub().then(function(data) {
         $scope.user = data;
      });
   }

})();
