(function () {

   'use strict';

   angular
      .module('homePage.socketfactory', [])
      .factory('socket', homeSocketFactory);

   homeSocketFactory.$inject = [];

   ////////

   function homeSocketFactory() {

      var socket = io.connect('localhost:4041');

      return {
         on: function (eventName, callback) {
            socket.on(eventName, callback);
         },
         emit: function (eventName, data) {
            socket.emit(eventName, data);
         }
      };

   }

})();
