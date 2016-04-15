(function() {

   angular.module('homeWelcome', [])
      .controller('homeController', homeIndex);

   ////////

   function homeIndex($scope) {
      $scope.title = 'Welcome to Hyperion Home';
   }

   homeIndex.$inject = ['$scope'];

})();
