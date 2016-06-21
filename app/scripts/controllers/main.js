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

app.controller('TableCtrl', function() {
  // use this controller to automatically build the table == TODO
  this.selectedRow = null;
  this.selectedFeature = null;
  this.setClickedRow = function(index, name) {
    this.selectedRow = index;
    this.selectedFeature = name;
  };
});

app.controller('MapCtrl', function() {
  this.center = {
    lat: 38.21,
    lng: -121.309,
    zoom: 12
  };
  this.defaults = {
    scrollWheelZoom: false
  };
  this.events = null;
});

app.controller('SiteCtrl', function($http) {
    var self = this;

    $http.get('map_multi.geojson').then(function(data) {
        self.geojson = data;
        self.features = self.geojson.data.features;
        });


    this.projects = [
        {
          name: 'DEM',
          snippet: 'Example',
          page: '/dem',
          year: '2015',
          variable: 'topography'
        }, {
          name: 'Water Quality',
          snippet: 'For monitoring...ex',
          page:'/wq',
          year: '2001',
          variable: 'water'
        }, {
          name: 'Groundwater',
          snippet: 'Groundwater wells',
          page: '/new',
          year: '2014',
          variable: 'soil'
      },
      {
        name: 'Stormwater sampling',
        snippet: 'For monitoring...storms',
        page:'/wq',
        year: '2016',
        variable: 'water'
      },
      ];
});

app.controller('PickerCtrl', function($scope) {

    $scope.clearSelections = function(){
        $scope.search.query = '';
        $scope.search.variable = '';
    };
});



app.filter('unique', ['$parse', function ($parse) {

  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
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
