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
          year: '2015'
        }, {
          name: 'Water Quality',
          snippet: 'For monitoring...ex',
          page:'/wq',
          year: '2001'
        }, {
          name: 'Groundwater',
          snippet: 'Groundwater wells',
          page: '/new',
          year: '2014'
        }
      ];
});

app.controller('PickerCtrl', function() {
    this.geojson = 'this';
});
