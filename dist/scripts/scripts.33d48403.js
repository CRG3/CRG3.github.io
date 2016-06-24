"use strict";angular.module("ngApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","leaflet-directive"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).otherwise({redirectTo:"/"})}]);var app=angular.module("ngApp");app.controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),app.controller("MapCtrl",function(){this.center={lat:38.276456,lng:-121.392615,zoom:12},this.defaults={scrollWheelZoom:!1},this.events=null}),app.controller("SiteCtrl",["$http","$scope","$filter",function(a,b,c){function d(a,c){a=a.feature,b.search.SelectedFID=a.properties.FID;var d={radius:15,fillColor:"#FFFF98",color:"#FFFF7F",weight:5,opacity:1,fillOpacity:.7};c.target.setStyle(d)}function e(a,c){a=a.feature,b.search.SelectedFID=null,console.log(c);var d={radius:15,fillColor:"#3232FF",color:"#0000FF",weight:1,opacity:1,fillOpacity:.8};c.target.setStyle(d)}var f={radius:15,fillColor:"#3232FF",color:"#0000FF",weight:1,opacity:1,fillOpacity:.8};a.get("geo.geojson").success(function(a){angular.extend(b,{geojson:{data:a,pointToLayer:function(a,b){return L.circleMarker(b,f)}},ProjectGeo:{data:a,pointToLayer:function(a,b){return L.circleMarker(b,f)}}})}),a.get("projects.json").then(function(a){b.projects=a.data}),this.clearSelections=function(){b.search.query="",b.search.variable="",b.search.year="",b.search.SelectedFID=null,b.selectedRow=null},this.tableClick=function(a){this.query=a.name},b.setClickedRow=function(a){b.selectedRow=a,b.search.SelectedFeature=b.selectedRow.FID},b.$on("leafletDirectiveGeoJson.myMap.mouseover",function(a,b){d(b.leafletObject,b.leafletEvent)}),b.$on("leafletDirectiveGeoJson.myMap.mouseout",function(a,b){e(b.leafletObject,b.leafletEvent)}),b.search={query:"",variable:"",year:"",SelectedFeature:null},b.$watchCollection("search",function(a,d){if(console.log("Search Values ",a),a!==d){for(var e=angular.copy(b.projects),f=c("filter")(e,b.search.query),g=c("customSearch")(f,b.search.variable,b.search.year),h=[],i=0;i<g.length;i++)h.push(g[i].FID);var j=angular.copy(b.ProjectGeo),k=c("filter")(j.data.features,function(a){for(var b=a.properties.FID,c=null,d=0;d<h.length;d++){if(b===h[d])return c=!0;if(c===!0)return a}});j.features=k,b.geojson.data=j}})}]),app.filter("unique",["$parse",function(a){return function(b,c){if(c===!1)return b;if((c||angular.isUndefined(c))&&angular.isArray(b)){var d=[],e=angular.isString(c)?a(c):function(a){return a},f=function(a){return angular.isObject(a)?e(a):a};angular.forEach(b,function(a){for(var b=!1,c=0;c<d.length;c++)if(angular.equals(f(d[c]),f(a))){b=!0;break}b||d.push(a)}),b=d}return b}}]),app.filter("customSearch",[function(){return function(a,b,c){var d=[];if(b&&c)for(var e=0;e<a.length;e++)-1!==a[e].variable.indexOf(b)&&-1!==a[e].year.indexOf(c)&&d.push(a[e]);else if(b)for(var f=0;f<a.length;f++)-1!==a[f].variable.indexOf(b)&&d.push(a[f]);else if(c)for(var g=0;g<a.length;g++)-1!==a[g].year.indexOf(c)&&d.push(a[g]);else d=a;return d}}]),angular.module("ngApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),angular.module("ngApp").run(["$templateCache",function(a){a.put("views/about.html","<p>This is the about view.</p>"),a.put("views/main.html",'<div ng-controller="SiteCtrl as ctrl"> <div class="row"> <div class="col-sm-3" id="sidebar"> <ul class="nav nav-stacked"> <li> <input ng-model="search.query" placeholder="Search"> </li> <li> <p>Filter by project type</p> <select class="selectpicker" ng-model="search.variable" ng-options=" feature.variable as feature.variable for feature in projects | unique:\'variable\' | orderBy:\'variable\'" fix> <option value="" selected>All types</option> </select> </li> <li> <p>Filter by year</p> <select class="selectpicker" ng-model="search.year" ng-options=" feature.year as feature.year for feature in projects | unique:\'year\' | orderBy:\'year\'" fix> <option value="" selected>All years</option> </select> </li> <li> <div class="form-group"> <button type="button" class="btn btn-grey" ng-click="ctrl.clearSelections()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Clear Selections</button> </div> </li> </ul> </div> <div class="col-sm-9" id="mainCol"> <div ng-controller="MapCtrl as map"> <div style="height:300px"> <leaflet id="myMap" center="map.center" geojson="geojson" events="events" width="100%" event-broadcast="events" height="100%"></leaflet> </div> </div> <div style="padding: 20px"></div> <div> <table border="1" style="width:100%"> <tr> <th><a href="" ng-click="orderByField = \'name\'; reverse=!reverse">Name</a></th> <th><a href="" ng-click="orderByField = \'variable\'; reverse=!reverse">Project Type</a></th> <th><a href="" ng-click="orderByField = \'year\'; reverse=!reverse">Year</a></th> <th><a href="">More information</a></th> </tr> <tr ng-repeat="project in projects | orderBy:orderByField:reverse | customSearch:search.variable:search.year | filter:search.query" ng-class="{\'selected\':project.FID == search.SelectedFID}" ng-click="setClickedRow(project)"> <td>{{project.name}}</td> <td>{{project.variable}}</td> <td>{{project.year}}</td> <td> <button type="button" class="btn btn-default btn-lg"> <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> details </button> </td> </tr> </table> </div> </div> </div> </div>')}]);