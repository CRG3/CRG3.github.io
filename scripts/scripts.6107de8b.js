"use strict";angular.module("ngApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ui.bootstrap","ui-leaflet","datatables"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/details/:projectID",{templateUrl:"views/details.html",controller:"DetailsCtrl",controllerAs:"details"}).otherwise({redirectTo:"/"})}]);var app=angular.module("ngApp");app.controller("MainCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}),app.controller("SiteCtrl",["$http","$scope","$filter","leafletData",function(a,b,c,d){a.get("projects.json").then(function(a){b.projects=a.data}),this.clearSelections=function(){b.search.query="",b.search.variable="",b.search.year="",b.selectedRow=null},b.setClickedRow=function(a){b.selectedRow=a},b.search={query:"",variable:"",year:""},b.$watchCollection("search",function(a,d){if(console.log("Search Values ",a),a!==d){var e=angular.copy(b.projects),f=c("filter")(e,b.search.query);c("customSearch")(f,b.search.variable,b.search.year)}})}]),app.filter("unique",["$parse",function(a){return function(b,c){if(c===!1)return b;if((c||angular.isUndefined(c))&&angular.isArray(b)){var d=[],e=angular.isString(c)?a(c):function(a){return a},f=function(a){return angular.isObject(a)?e(a):a};angular.forEach(b,function(a){for(var b=!1,c=0;c<d.length;c++)if(angular.equals(f(d[c]),f(a))){b=!0;break}b||d.push(a)}),b=d}return b}}]),app.filter("customSearch",[function(){return function(a,b,c){var d=[];if(b&&c)for(var e=0;e<a.length;e++)-1!==a[e].variable.indexOf(b)&&-1!==a[e].year.indexOf(c)&&d.push(a[e]);else if(b)for(var f=0;f<a.length;f++)-1!==a[f].variable.indexOf(b)&&d.push(a[f]);else if(c)for(var g=0;g<a.length;g++)-1!==a[g].year.indexOf(c)&&d.push(a[g]);else d=a;return d}}]),angular.module("ngApp").controller("AboutCtrl",function(){this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]});var app=angular.module("ngApp");app.controller("DetailsCtrl",["$http","$routeParams","$scope","leafletData","DTOptionsBuilder","DTColumnBuilder","$q","$sce","$filter",function(a,b,c,d,e,f,g,h,i){function j(a,b){console.log(a),console.log(a.feature.properties),b.target.bindPopup(c.popupMessage(a.feature.properties,c.popupFields)),b.target.openPopup()}this.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.get("projects/"+b.projectID+".json").then(function(a){return a.data}).then(function(a){c.project=a,a.tabs.table===!0&&(c.url=a.table.url,c.columns=a.table.columns,l()),a.tabs.customMap===!0&&(c.iframeUrl=h.trustAsResourceUrl(a.iframe)),a.tabs.map===!0&&(c.geojsonURL=a.map.geojsonURL,c.popupFields=a.map.popup,m())});var k={radius:5,fillColor:"#3232FF",color:"#0000FF",weight:1,opacity:1,fillOpacity:.8};this.activetab="metadata",c.centerJSON=function(){d.getMap("MyMap").then(function(a){var b=[];console.log(c.geojson.data.features.length);for(var d=0;d<c.geojson.data.features.length;d++){var e=c.geojson.data.features[d];if("Point"===e.geometry.type){var f=e.geometry.coordinates;b.push(L.GeoJSON.coordsToLatLng(f))}else if("MultiPoint"===e.geometry.type)for(var g=0;g<e.geometry.coordinates.length;g++){var h=e.geometry.coordinates[g];b.push(L.GeoJSON.coordsToLatLng(h))}else if("Polygon"===e.geometry.type){var i=e.geometry.coordinates[0];for(var j in i){var k=i[j];b.push(L.GeoJSON.coordsToLatLng(k))}}else console.log("Unknown feature geometry type. Try using points, multipoints, or polygons")}a.fitBounds(b)})};var l=function(){var b=function(a){for(var b=[],c=0;c<a.length;c++)b.push(f.newColumn(a[c]).withTitle(a[c]));return b};c.dtOptions=e.fromFnPromise(function(){var b=g.defer();return a.get(String(c.url)).then(function(a){b.resolve(a.data)}),b.promise}).withPaginationType("full_numbers"),c.dtColumns=b(c.columns)},m=function(){a.get(c.geojsonURL).success(function(a){angular.extend(c,{geojson:{data:{type:"FeatureCollection",features:a.features},pointToLayer:function(a,b){return L.circleMarker(b,k)}}})})};c.popupMessage=function(a,b){for(var c="",d=0;d<b.length;d++){var e=b[d],f=a[e];c=c+e+": "+f+"<br>"}return c},c.$on("leafletDirectiveGeoJson.MyMap.click",function(a,b){console.log("click"),j(b.leafletObject,b.leafletEvent)})}]),angular.module("ngApp").run(["$templateCache",function(a){a.put("views/about.html",'<h2>Data explorer for Consumnes Research Group III</h2> <h3>About</h3> <p>The University of California, Davis, in association with the seven agency and non-profit partners of the Cosumnes River Preserve, has established a coordinated university/agency/foundation partnership dedicated to advancing watershed science to support more effective and sustainable watershed restoration practices and addressing the information needs of adaptive management in the North Delta and the Cosumnes and Mokelumne River watersheds. Faculty and students from a variety of disciplines --- hydrology, geology, engineering, ecology, wildlife biology --- are monitoring regional hydrogeomorphic and ecologic processes in order to evaluate and guide ecosystem conservation and restoration efforts. This work is coordinated by the UCD Center for Watershed Science and Management, and has been supported by grants from the David and Lucille Packard Foundation, CALFED, The Nature Conservancy, and multiple agency/foundation partners</p> <p>More info: <a href="https://watershed.ucdavis.edu/doc/cosumnes-research-group">Cosumnes Research Group</a></p> <h3>Data</h3> <p>The data for the CRG3 project is available on Github at: <a href="https://github.com/CRG3/data">https://github.com/CRG3/data</a></p>'),a.put("views/details.html",'<div ng-controller="DetailsCtrl as details"> <h3>{{project.name}}</h3> <ul class="nav nav-tabs"> <li ng-class="{active:details.activetab === \'metadata\'}"><a ng-click="details.activetab = &quot;metadata&quot;">Metadata</a></li> <li ng-class="{active:details.activetab === \'location\'}" ng-hide="project.tabs.map === false"><a ng-click="details.activetab = &quot;location&quot;">Map</a></li> <li ng-class="{active:details.activetab === \'data\'}" ng-hide="project.tabs.table === false"><a ng-click="details.activetab = &quot;data&quot;">Data</a></li> <li ng-class="{active:details.activetab === \'download\'}" ng-hide="project.tabs.download === false"><a ng-click="details.activetab = &quot;download&quot;">Download</a></li> <li ng-class="{active:details.activetab === \'customMap\'}" ng-hide="project.tabs.customMap === false"><a ng-click="details.activetab = &quot;customMap&quot;">Other</a></li> </ul> <div class="tab-content" style="padding:10px"> <div ng-switch="details.activetab"> <div ng-switch-when="metadata"> <p><b>About:</b> {{project.details}}</p> <p><b>Contact:</b> {{project.contact}}</p> <p><b>Dates:</b> {{project.dates}}</p> <p><b>Variables:</b> <li ng-repeat="variable in project.variables"> {{variable}} </li> </p> </div> <div ng-switch-when="data"> {{table}} <div> <table datatable="" dt-options="dtOptions" dt-columns="dtColumns" class="row-border hover"></table> </div> </div> <div ng-switch-when="location"> <div style="height:300px"> <leaflet id="MyMap" geojson="geojson" height="100%" ng-init="centerJSON()"></leaflet> <input type="button" value="Click to Center" ng-click="centerJSON()"> </div> </div> <div ng-switch-when="download"> <ul> <li ng-repeat="download in project.downloads"> <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span> <a download href="{{download.url}}"> {{download.name}} </a> </li> </ul> </div> <div ng-switch-when="customMap"> <div style="height: 400px"> <iframe ng-src="{{iframeUrl}}" scrolling="no" frameborder="0" style="position: relative; height: 100%; width: 100%"></iframe> </div> </div> </div> </div> </div>'),a.put("views/main.html",'<div ng-controller="SiteCtrl as ctrl"> <div class="row"> <div class="col-sm-3" id="sidebar"> <div class="userInput"> <input ng-model="search.query" placeholder="Search"> </div> <div class="userInput"> <p>Filter by project type</p> <select class="selectpicker" ng-model="search.variable" ng-options=" feature.variable as feature.variable for feature in projects | unique:\'variable\' | orderBy:\'variable\'" fix> <option value="" selected>All types</option> </select> </div> <!--<li>\n            <p>Filter by year</p>\n            <select class="selectpicker" ng-model=\'search.year\' ng-options=" feature.year as feature.year for feature in projects | unique:\'year\' | orderBy:\'year\'" fix>\n              <option value="" selected="selected">All years</option>\n            </select>\n        </li>--> <div class="userInput"> <button type="button" class="btn btn-grey" ng-click="ctrl.clearSelections()"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Clear Selections</button> </div> </div> <div class="col-sm-9" id="mainCol"> <div style="padding: 20px"></div> <div> <div ng-repeat="project in projects | orderBy:orderByField:reverse | customSearch:search.variable:search.year | filter:search.query" ng-class="{\'selected\':project.FID == SelectedFID}" ng-click="setClickedRow(project)"> <div class="project"> <a href="#/details/{{project.id}}"><h3>{{project.name}}</h3></a> <div class="ribbon" ng-class="project.variable"><span>{{project.variable}}</span></div> {{project.details}}<br> <!--<a href="#/details/{{project.id}}"><button type="button" class="btn btn-default btn-lg">\n            <span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> details\n        </button></a>--> </div> <div style="padding: 10px"></div> </div> </div> </div> </div></div>')}]);