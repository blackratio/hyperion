(function () {

   'use strict';

   angular
      .module('homePage', [
         'homePage.factory',
         'homePage.socketfactory'
      ])
      .controller('homeController', homeController);

   homeController.$inject = ['homeFactory', 'socket', '$scope'];

   ////////

   function homeController(homeFactory, socket, $scope) {
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

      /* constructeur */
      function monContructeur(a, b, c, d) {
         this.nom = a;
         this.prenom = b;
         this.age = c;
         this.sex = d;
      }

      /* methodes de monContructeur */
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

      test1.createID();
      test2.createID();

      class SimpleDate {
         constructor(year, month, day) {
            this._year = year;
            this._month = month;
            this._day = day;
         }
         getDay() {
            return this._day;
         }
      }

      let today = new SimpleDate(2000, 2, 28);
      let test = today.getDay();

      //console.log(test);


      vm.newCustomers = [];
      vm.currentCustomer = {};

      vm.join = function (currentCustomer) {
         socket.emit('add-customer', currentCustomer);
      };

      socket.on('notification', function (data) {
         $scope.$apply(function () {
            vm.newCustomers.push(data.customer);
         });
         console.log(vm.newCustomers);
      });

   }

})();
