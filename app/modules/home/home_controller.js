(function() {

   'use strict';

   angular
      .module('homeWelcome', [
         'homeWelcome.service'
      ])
      .controller('homeController', homeIndex);

   ////////

   function homeIndex($scope, githubApi) {
      var homeTitle = {
         title: 'Welcome to Hyperion Home',
         subtitle: 'The modular Css Framework'
      };
      $scope.homeContent = homeTitle;
      githubApi.getUser().then(function(data) {
         $scope.user = data;
      });
   }

   homeIndex.$inject = ['$scope', 'githubApi'];

})();
