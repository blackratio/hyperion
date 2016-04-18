(function() {

   'use strict';

   angular
      .module('homeWelcome', [
         'homeWelcome.service'
      ])
      .controller('homeController', homeIndex);

   ////////

   function homeIndex($scope, githubApi) {
      $scope.homeContent = {
         title: 'Welcome to Hyperion Home',
         subtitle: 'The modular Css Framework'
      };
      githubApi.getUser().then(function(response) {
         console.log(response);
         $scope.user = response;
      });

   }

   homeIndex.$inject = ['$scope', 'githubApi'];

})();
