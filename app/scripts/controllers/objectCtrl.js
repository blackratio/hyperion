'strict';

controllers.controller('objectController', ['$scope', '$timeout', 'objectServices',
   function($scope, $timeout, objectServices) {


      // Initialize vm (replace scope) to this value : controllerAs implementation
      const vm = this;


      // create Leaflet draw function
      // Return selected markers
      mapCreateDraw = (map, drawnItems, markerDataAll) => {
         map.on('draw:created', function(e) {

            const layer = e.layer;
            drawnItems.addLayer(layer);
            const shape = layer.toGeoJSON();

            const mapdata = objectServices.isLocatedInZone(layer, markerDataAll);

            $scope.$apply(function() {
               vm.jsonData = mapdata;
               vm.visData = mapdata;
            });

         });
      };


      // create Leaflet draw function
      // Return selected markers
      mapDeleteDraw = (map, markerDataAll) => {
         map.on('draw:deleted', function(e) {

            $scope.$apply(function() {
               vm.jsonData = markerDataAll;
               vm.visData = markerDataAll;
            });

         });
      };


      // Construct Map
      constructMap = (x) => {

         // Construct personnal array from data
         const filteredOnlyMapMarkers = _.filter(x, function(n) {
            return n.lat !== undefined;
         });

         const mapserver = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data From Map Server'
         });

         const map = L.map('map')
            .setView([50.5, 30.51], 15)
            .addLayer(mapserver);

         const markers = L.markerClusterGroup();

         /*
         var techs = _(x).chain().flatten().pluck('techs').unique().value();
         var layereee = {};
         for (var i in techs) {
            layereee[techs[i]] = L.featureGroup.subGroup(markers);
         }
         */

         const categ = L.featureGroup.subGroup(markers);

         const control = L.control.layers(null, null, {
            // Option wrapp layer option on icon menu
            collapsed: false
         });

         const drawnItems = new L.FeatureGroup();
         map.addLayer(drawnItems);
         const drawControl = new L.Control.Draw({
            edit: {
               featureGroup: drawnItems
            }
         });


         map.addControl(drawControl);
         markers.addTo(map);


         // Use Loadmarker service
         // Create all markers
         objectServices.loadMarkers(filteredOnlyMapMarkers, categ, control, map);


         categ.addTo(map);
         map.fitBounds([filteredOnlyMapMarkers]);


         // Leaflet Draw function - CREATE / EDIT / DELETE
         mapCreateDraw(map, drawnItems, filteredOnlyMapMarkers);
         mapDeleteDraw(map, filteredOnlyMapMarkers);

      };


      // Call objectServices factory -> callOject ( data.json )
      const markerPromise = objectServices.callOject();
      markerPromise
         .then(function(data) {

            vm.jsonData = data;
            $timeout(function() {
               vm.visData = data;
            }, 400);

            const markerDataAll = data;

            constructMap(data);

         });

   }
]);
