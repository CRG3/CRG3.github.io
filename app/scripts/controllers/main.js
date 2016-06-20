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


app.controller('ProjectCtrl', function() {
  this.sites = [];
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
  this.test = 'I m a test controller';
  this.again = 'redo';
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

app.controller('SiteCtrl', function($scope, $http) {
    var self = this;
    $http.get('map.geojson').then(function(response) {
    var features = [];
    for (var i = 0; i < response.data.features.length; i++) {
      var feat = response.data.features[i];
      features.push(feat);
    }
    self.sites = features;
    self.geojson = {
      data: response.data
    };
  });

  $scope.search = {
      name: '',
      variable: '',
  };
});
