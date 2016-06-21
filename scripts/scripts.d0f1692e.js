"use strict";angular.module("ngApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","leaflet-directive"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"})}]);var app=angular.module("ngApp");app.controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),app.controller("ProjectCtrl",function(){this.sites=[]}),app.controller("TableCtrl",function(){this.selectedRow=null,this.selectedFeature=null,this.setClickedRow=function(a,b){this.selectedRow=a,this.selectedFeature=b}}),app.controller("MapCtrl",function(){this.test="I m a test controller",this.again="redo",this.center={lat:38.21,lng:-121.309,zoom:12},this.defaults={scrollWheelZoom:!1},this.events=null}),app.controller("SiteCtrl",["$scope","$http","$filter",function(a,b,c){b.get("map.geojson").then(function(b){a.geojson=b,a.data=b}),a.search={"var":""},a.$watch("search",function(b,d){if(!angular.equals(d,b)){var e=angular.copy(a.data);angular.forEach(d,function(a,b){console.log(e),console.log(b+" : "+a),""!==a&&(e=c("filter")(e,b,a),console.log(e))})}},!0)}]),angular.module("ngApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("ngApp").filter("filter",[function(){return function(a,b,c){var d={type:"FeatureCollection",features:[]};return angular.forEach(a.features,function(a){if(a.properties.hasOwnProperty(b)){var e=a.properties[b].toLowerCase(),f=c.toLowerCase();e.indexOf(f)>-1&&d.features.push(a)}}),d}}]),angular.module("ngApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/main.html",'<div ng-controller="SiteCtrl as locs"> <div ng-controller="MapCtrl as map" class="jumbotron"> <div style="height:300px"> <leaflet center="map.center" geojson="geojson" events="map.events" width="100%" height="100%"></leaflet> </div> </div> <div class="row marketing"> <div class="sidebar"> <form role="form"> <select class="selectpicker" ng-model="search.var" ng-options="feature.properties.var as feature.properties.var for feature in geojson.data.features"> </select> </form></div>  </div> <h2>test {{search.test}}</h2> <div ng-controller="TableCtrl as table"> <div> selectedRow = {{table.selectedRow}} feature = {{table.selectedFeature}} </div> <div class="row"> <div class="col-md-8 col-md-offset-2"> <table border="1" style="width:100%"> <tr> <th>Name</th> <th>Variable</th> <th>Location</th> </tr> <tr ng-repeat="feature in geojson.data.features" ng-class="{\'selected\':$index == table.selectedRow}" ng-click="table.setClickedRow($index)"> <td>{{feature.properties.name}}</td> <td>{{feature.properties.var}}</td> <td>{{feature.geometry.coordinates}}</td> </tr> </table> </div> </div> </div> </div>')}]);