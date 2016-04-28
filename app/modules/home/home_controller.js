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
      /* jshint validthis: true */
      const vm = this;

      let homeTitle = {
         title: 'Hyperion',
         subtitle: 'Modular SASS/CSS Framework !'
      };

      vm.homeContent = homeTitle;
      homeFactoryRequest.gitHub().then(function(data) {
         vm.user = data;
      });
   }

})();
