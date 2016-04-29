(function () {

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

      homeFactory.frameworkContent().then(function (data) {
         vm.frameWorkDatas = data;
      });

      /* constructeur de ClasseA */
      function monContructeur(a, b, c, d) {
         this.nom = a;
         this.prenom = b;
         this.age = c;
         this.sex = d;
      }

      /* methodes de ClasseA */
      monContructeur.prototype.createID = function () {
         return ({
            'nom': this.nom,
            'prenom': this.prenom,
            'age': this.nom,
            'sex': this.prenom
         });
      };

      var test1 = new monContructeur('jean', 'michel', 31, 'Homme');
      var test2 = new monContructeur('Bruno', 'poulpe', 59, 'Homme');

      console.log(test1.createID(), test2.createID());

   }

})();
