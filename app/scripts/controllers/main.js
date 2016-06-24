'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngApp
 */
var app = angular.module('ngApp');

app.controller('MainCtrl', function() {
  this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
});


app.controller('MapCtrl', function() {
  this.center = {
    lat: 38.276456,
    lng: -121.392615,
    zoom: 12
  };
  this.defaults = {
    scrollWheelZoom: false
  };
  this.events = null;
});



app.controller('SiteCtrl', function($http, $scope, $filter) {
    var geojsonMarkerOptions = {
    			    radius: 15,
    			    fillColor: '#3232FF',
    			    color: '#0000FF',
    			    weight: 1,
    			    opacity: 1,
    			    fillOpacity: 0.8
    			};

  //var self = this;
  $http.get('geo.geojson').success(function(data) {
    angular.extend($scope, {
      geojson: {
        data: data,
        pointToLayer: function(feature, latlng){
                            return L.circleMarker(latlng, geojsonMarkerOptions);
                        }
        //console.log(layers);

      },
      ProjectGeo: {
        data: data,
        pointToLayer: function(feature, latlng){
                            return L.circleMarker(latlng, geojsonMarkerOptions);
                        }
    }

    });
  });



  //build custom layers


  $http.get('projects.json').then(function(data2) {
    $scope.projects = data2.data;
  });

  this.clearSelections = function() {
    $scope.search.query = '';
    $scope.search.variable = '';
    $scope.search.year = '';
    $scope.search.SelectedFeature = null;
    $scope.selectedRow = null;
  };



  this.tableClick = function(dat) {
    this.query = dat.name;
  };

  // highlight selected row in table
  //$scope.selectedRow = null;
  $scope.setClickedRow = function(index) {
    $scope.selectedRow = index;
    $scope.search.SelectedFeature = $scope.selectedRow.FID;
  };


  function projectClick(project, eve) {
    project = project.feature;
    $scope.search.SelectedFeature = project.properties.FID;
    console.log(eve);
    var target = eve.target;
    //console.log(eve.layer._icon);
    var highlight = {
    			    radius: 15,
    			    fillColor: '#FFFF98',
    			    color: '#FFFF7F',
    			    weight: 5,
    			    opacity: 1,
    			    fillOpacity: 0.7
    			};


    target.setStyle(highlight);

  }


  $scope.$on('leafletDirectiveGeoJson.myMap.click', function(ev, leafletPayload) {
    console.log(leafletPayload.leafletObject, leafletPayload.leafletEvent);
    projectClick(leafletPayload.leafletObject, leafletPayload.leafletEvent);
  });



  // set initial values
  $scope.search = {
    query: '',
    variable: '',
    year: '',
    SelectedFeature: null
  };

  // watch the search collection
  $scope.$watchCollection('search', function(newValue, oldValue) {
    console.log('Search Values ', newValue);
    if (newValue === oldValue) {
      return;
    }


    // get a copy of the sites json info
    var x = angular.copy($scope.projects);

    // filter using the search query
    var filtered = $filter('filter')(x, $scope.search.query);

    // filter using the drop downs
    var filtered2 = $filter('customSearch')(filtered, $scope.search.variable, $scope.search.year);

    // get list of FID's from the site json
    var FIDs = [];
    for (var i = 0; i < filtered2.length; i++) {
      FIDs.push(filtered2[i].FID);
    }
    //console.log('Site Fids length', FIDs.length);

    // match the selected FIDs with the geojson FID
    var geo = angular.copy($scope.ProjectGeo);

    var geoSub = $filter('filter')(geo.data.features, function(feature) {
      var geoFID = feature.properties.FID;
      var match = null;
      for (var j = 0; j < FIDs.length; j++) {
        if (geoFID === FIDs[j]) {
          match = true;
          return match;
        }
        if (match === true) {
          return feature;
        }
      }

    });


    //console.log('Geo features', geoSub.length);
    geo.features = geoSub;
    $scope.geojson.data = geo;
  });

});


app.filter('unique', ['$parse', function($parse) {

  return function(items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function(item) {
          return item;
        };

      var extractValueToCompare = function(item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function(item) {
        var isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
}]);


//filter name customSearch
app.filter('customSearch', [function() {
  /** @data is the original data**/
  /** @variable is the search query for variable**/
  /** @year is the search query for year**/
  return function(data, variable, year) {
    var output = []; // store result in this
    /**@case1 if both searches are present**/
    if (!!variable && !!year) {
      //loop over the original array
      for (var i = 0; i < data.length; i++) {
        // check if any result matching the search request
        if (data[i].variable.indexOf(variable) !== -1 && data[i].year.indexOf(year) !== -1) {
          //push data into results array
          output.push(data[i]);
        }
      }
    } else if (!!variable) { /**@case2 if only variable query is present**/
      for (var j = 0; j < data.length; j++) {
        if (data[j].variable.indexOf(variable) !== -1) {
          output.push(data[j]);
        }
      }
    } else if (!!year) { /**@case3 if only year query is present**/
      for (var k = 0; k < data.length; k++) {
        if (data[k].year.indexOf(year) !== -1) {
          output.push(data[k]);
        }
      }
    } else {
      /**@case4 no query is present**/
      output = data;
    }
    return output; // finally return the result
  };
}]);
