services.factory('objectServices', ['$http', '$q', 'leafletData', '_', 'moment', '$compile', '$rootScope',
   function($http, $q, leafletData, _, moment, $compile, $rootScope) {

      return {

         callOject: function() {

            const deferred = $q.defer();
            const url = 'data/objectbig.json';

            $http({
                  url: url,
                  method: "GET"
               })
               .success(function(data) {
                  const test = data;

                  // Push mandatory timeData to Array
                  itemsData = (item) => {

                     const timeR = new Date(item.start);
                     const contentR = item.techs;
                     const messageR = "<popup-map loc='mapData[" + item.guid + "]'></popup-map>";
                     const htmlR = '<div class="leafmarker ' + item.techs + '"' + '></div>';

                     item.start = timeR;
                     item.content = contentR;
                     //item.group = item.techs;
                     item.message = messageR;
                     item.icon = {
                        type: 'div',
                        iconSize: [40, 0],
                        html: htmlR,
                        popupAnchor: [0, 0]
                     };

                  };

                  // for each item in items array, use pushtimeData function
                  _(test).each(itemsData).value();

                  deferred.resolve(data);
               })
               .error(function(response) {
                  deferred.reject();
               });

            return deferred.promise;

         },

         /**
          * [loadMarkers description]
          * @param  {[type]} x       [description]
          * @param  {[type]} categ   [description]
          * @param  {[type]} control [description]
          * @param  {[type]} map     [description]
          * @return {[type]}         [description]
          */
         loadMarkers: function(x, categ, control, map) {

            for (var i = 0; i < x.length; i++) {

               const icon = L.divIcon({
                  popupAnchor: [0, -30],
                  iconSize: [30, 70],
                  html: '<div class="markertype ' + x[i].techs + '"' + '></div>'
               });
               //var marker = new L.Marker(new L.LatLng(x[i].lat, x[i].lng));
               var marker = L.marker([x[i].lat, x[i].lng], {
                  icon: icon
               });

               const pop =
                  '<h3>' + 'position' + '</h3>' +
                  '<h5>' + 'lat : ' + x[i].lat + '</h5>' +
                  '<h5>' + 'lng : ' + x[i].lng + '</h5>';

               marker.bindPopup(pop);

               marker.addTo(categ);

            }

            // Add layer categ control to map
            //control.addOverlay(categ, 'Categ1');
            //control.addTo(map);

            // Add layer by category

            return;

         },

         isLocatedInZone: function(layer, mapdata) {

            const filterMapresults = [];
            for (i = 0; i < mapdata.length; i++) {
               if (layer.getBounds().contains([mapdata[i].lat, mapdata[i].lng])) {
                  filterMapresults.push(mapdata[i]);
               }
            }

            return filterMapresults;
         }

      };

   }
]);


/*_(z).each(function(time) {
   var markerGender = time.gender;
   if (!param || markerGender === param) {
      pushtimeData(time);
   }
}).value();*/

/*_.sortBy( markers, function(x){ return x.layer; } );
var groups = _.groupBy( markers, 'layer' );*/

/*var newArr = _.map(x, function(element) {
   var markerGender = element.gender;
   if (!param || markerGender === param) {
      return _.extend({}, element, {
         id: element.guid,
         content: element.name + '-' + element.gender,
         start: element.registered
      });
   }
});*/
