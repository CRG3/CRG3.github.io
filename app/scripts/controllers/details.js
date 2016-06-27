'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:DetailsCtrl
 * @description
 * # DetailsCtrl
 * Controller of the ngApp
 */
angular.module('ngApp')
  .controller('DetailsCtrl', function($http, $routeParams, $scope, leafletData) {
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];

      var self = this;


      $http.get('projects/' + $routeParams.projectID + '.json').then(function(response) {
        self.project = response.data;
      });

      var geojsonMarkerOptions = {
      			    radius: 15,
      			    fillColor: '#3232FF',
      			    color: '#0000FF',
      			    weight: 1,
      			    opacity: 1,
      			    fillOpacity: 0.8
      			};


      $http.get('projects/' + $routeParams.projectID + '.geojson').success(function(data){
        angular.extend($scope, {
            geojson: {
              data: data,
              pointToLayer: function(feature, latlng) {
                  return L.circleMarker(latlng, geojsonMarkerOptions);
              }
                //console.log(layers);

            }
        });
    });


        this.activetab = 'metadata';


        $scope.fitBounds = function() {
                leafletData.getMap('map').then(function(map) {
                    console.log(map);
                    map.getLayers().then(function(layers){
                        console.log(layers);
                        //var layer = layers.overlays;
                        //map.fitBounds(layer.getBounds());
                    })
                    //map.fitBounds([ [40.712, -74.227], [40.774, -74.125] ]);
                });
            };

    $scope.centerJSON = function() {
      leafletData.getMap('map').then(function(map) {
          var latlngs = [];
          for (var i in $scope.geojson.data.features[0].geometry.coordinates) {
              var coord = $scope.geojson.data.features[0].geometry.coordinates[i];
              console.log(coord);
              for (var j in coord) {
                  var points = coord[j];
                  console.log(points);
                  latlngs.push(L.GeoJSON.coordsToLatLng(points));

              }
          }
          console.log(latlngs);
          map.fitBounds(latlngs);
      });
  };



      });
