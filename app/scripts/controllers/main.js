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
    var self = this;
    $http.get('geo.geojson').then(function(data) {
        self.geojson = data;
        $scope.geojson = data;
        });


    $http.get('projects.json').then(function(data2) {
            $scope.projects = data2.data;
            });

     this.clearSelections = function(){
         $scope.search.query = '';
         $scope.search.variable = '';
         $scope.search.year = '';
         this.selectedRow = null;
         $scope.geojson = this.geojson;
      };



      this.tableClick = function(dat){
          this.query = dat.name;
      };

      // highlight selected row in tabble
      this.selectedRow = null;
      this.setClickedRow = function(index) {
        this.selectedRow = index;
      };

      $scope.search = {
          query: '',
          variable: '',
          year: ''
      };

      // watch the search collection
      $scope.$watchCollection('search', function(newValue, oldValue){
          console.log(newValue, oldValue);
          if(newValue === oldValue){
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
          for(var i=0; i< filtered2.length; i++){
              FIDs.push(filtered2[i].FID);
          }
          //console.log(FIDs.length);

          // match the selected FIDs with the geojson FID
          var geo = angular.copy($scope.geojson);

          var geoSub = $filter('filter')(geo.data.features, function(feature){
              var geoFID = feature.properties.FID;
              var match = null;
              for(var j=0; j<FIDs.length; j++){
                  if(geoFID === FIDs[j]){
                      match = true;
                      return match;
                  }
             return match;
              }

              });

         console.log(geoSub);

         $scope.geojson.data = {
                  features: geoSub
              };

      });

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


//filter name customSearch
app.filter('customSearch',[function(){
    /** @data is the original data**/
    /** @variable is the search query for variable**/
    /** @year is the search query for year**/
    return function(data,variable,year){
        var output = []; // store result in this
        /**@case1 if both searches are present**/
        if(!!variable && !!year){
            variable = variable.toLowerCase();
            year = year.toLowerCase();
            //loop over the original array
            for(var i = 0;i<data.length; i++){
                // check if any result matching the search request
                if(data[i].variable.toLowerCase().indexOf(variable) !== -1 && data[i].year.toLowerCase().indexOf(year) !== -1){
                    //push data into results array
                    output.push(data[i]);
                }
            }
        } else if(!!variable){ /**@case2 if only variable query is present**/
            variable = variable.toLowerCase();
            for(var j = 0;j<data.length; j++){
                if(data[j].variable.toLowerCase().indexOf(variable) !== -1){
                    output.push(data[j]);
                }
            }
        } else if(!!year){ /**@case3 if only year query is present**/
            year = year.toLowerCase();
            for(var k = 0;k<data.length; k++){
                if(data[k].year.toLowerCase().indexOf(year) !== -1){
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
