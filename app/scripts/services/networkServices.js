'strict';

services.factory('networkServices', ['$http', '$q', '_',
   function($http, $q, _) {

      return {

         graphCallOject: function() {

            var deferred = $q.defer();
            var url = 'data/graph.json';

            $http({
                  url: url,
                  method: "GET"
               })
               .success(function(data) {
                  deferred.resolve(data);
               })
               .error(function(response) {
                  deferred.reject(data);
               });

            return deferred.promise;

         },

         graphCallOjectChildren: function() {

            const deferred = $q.defer();
            const url = 'data/graph_children.json';

            $http({
                  url: url,
                  method: "GET"
               })
               .success(function(data) {
                  deferred.resolve(data);
               })
               .error(function(response) {
                  deferred.reject();
               });

            return deferred.promise;

         }

      };
   }
]);
