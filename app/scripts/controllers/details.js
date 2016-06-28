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


    $http.get('projects/' + $routeParams.projectID + '.geojson').success(function(data) {
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


    //center map to geojson extent
    $scope.centerJSON = function() {
    leafletData.getMap('MyMap').then(function(map) {
      var latlngs = [];
      // loop through all the features in the geojson file
      for (var f = 0; f < $scope.geojson.data.features.length; f++) {
        var feature = $scope.geojson.data.features[f];
        if (feature.geometry.type === 'Point') {
          var coord = feature.geometry.coordinates;
          latlngs.push(L.GeoJSON.coordsToLatLng(coord));
        } else if (feature.geometry.type === 'MultiPoint') {
          for (var i = 0; i < feature.geometry.coordinates.length; i++) {
            var coord = feature.geometry.coordinates[i];
            latlngs.push(L.GeoJSON.coordsToLatLng(coord));
          }
        } else if (feature.geometry.type === 'Polygon') {
          var coordArray = feature.geometry.coordinates[0];
          for (var j in coordArray) {
            var coord = coordArray[j];
            latlngs.push(L.GeoJSON.coordsToLatLng(coord));
          }
        } else {
          console.log('Unknown feature geometry type. Try using points, multipoints, or polygons')
        }
      }
      map.fitBounds(latlngs);
    });
    };



  });
