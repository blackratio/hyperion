// Return Lodash _ service for lodash

services.factory('_', ['$window',
function ($window){
   return $window._;
}]);
services.factory('moment', ['$window',
function ($window){
   return $window.moment;
}]);
