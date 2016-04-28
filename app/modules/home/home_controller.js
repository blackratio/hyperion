(function() {

   'use strict';

   angular
      .module('homePage', [
         'homePage.factory'
      ])
      .controller('homeController', homeController);

   homeController.$inject = ['homeFactory'];

   ////////

   function homeController(homeFactory) {
      /* jshint validthis: true */
      const vm = this;

      let homeTitle = {
         title: 'Hyperion',
         subtitle: 'Modular SASS/CSS Framework !'
      };

      vm.homeContent = homeTitle;
      homeFactory.gitHub().then(function(data) {
         vm.user = data;
      });
   }

})();
