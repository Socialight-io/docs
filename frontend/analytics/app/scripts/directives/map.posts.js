'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:map.posts
 * @description
 * # map.posts
 */
angular.module('analyticsApp')
  .directive('mapposts', ['$timeout', '$http', function ($timeout, $http) {
    return {
      template: '<div style="height: {{ scope.options.height || 500 }}px;" id="{{ id }}"></div>',
      restrict: 'A',
      scope: { 
      	data: "="
      },
      link: function postLink(scope, element, attrs) {
        var map;

        scope.id = "chart-" + Math.round(Math.random() * 1000000);

      	scope.$watch('data', function () { 
      		if (scope.data && scope.data.length > 0) { 
      			init(scope.data);
      		}
      	});

		function init() {

		  if (!google) { return false; }

		  var mapOptions = {
		    zoom: 2,
		    center: new google.maps.LatLng(35.173808, -37.26562),
		    styles: mapStyles,
		    scrollwheel: false,
		    navigationControl: false,
		    mapTypeControl: false,
		  };

		  
		  map = new google.maps.Map(document.getElementById(scope.id),
		      mapOptions);

		  var geocodes = [];

		  _.each(scope.data, function (d) { 
		  	if (d.location.lat != null) {
		  		addCircle(d);
			} else if (d.location.place != null) { 
				geocodes.push(d);
			}
		  });

		  geocodePlaces(geocodes);
		}

		function addCircle(d) { 
			var circleOptions = {
			  strokeColor: '#FF0000',
			  strokeOpacity: 0,
			  strokeWeight: 2,
			  fillColor: '#cd75d0',
			  fillOpacity: 0.35,
			  map: map,
			  radius: 120000,
			  center: new google.maps.LatLng(d.location.lat, d.location.lng)
			};

		    var circle = new google.maps.Circle(circleOptions);
		}


		function geocodePlaces(data) { 
		  async.mapLimit(scope.data, 3, geocodePlace, function (reruns) { 
		  	if (reruns > 0) { 
		  		geocodePlaces(reruns);
		  	}
		  });
		}

		var geocoder = google ? new google.maps.Geocoder() : {};


		function geocodePlace(d, callback) {

			if (d == null) { return false; }

			geocoder.geocode( { 'address': d.location.place }, function(results, status) {
			   if (status == google.maps.GeocoderStatus.OK && results[0]) {
				    // Add the circle for this city to the map.
					var circleOptions = {
					  strokeColor: '#FF0000',
					  strokeOpacity: 0,
					  strokeWeight: 2,
					  fillColor: '#cd75d0',
					  fillOpacity: 0.35,
					  map: map,
					  radius: 120000,
					  center: results[0].geometry.location
					};

				    var circle = new google.maps.Circle(circleOptions);

					var address = {};

					_.each(results[0].address_components, function (e) { 
						_.each(e.types, function (f) { 
							address[f] = e.long_name;
						});
					});

					address.place = d.location.place;

					d.location = address;
					d.location.lat = results[0].geometry.location.lat();
					d.location.lng = results[0].geometry.location.lng();

					$http.post(_config.api + "/friends", { 
			            params: {
			                token: _config.group.token,
			                uid: _config.group.id
			            },
			            data: d
			        }).success(function (d) { 
			        	console.log(d);
				   		$timeout(function () { 
				   			callback(null);
				   		}, 1000);
			        });
				} else if (status == "OVER_QUERY_LIMIT") { 
					$timeout(function () {
						callback(d);
					}, 2000); 
				} else { 
					$timeout(function () { 
						callback(null);
					}, 1000);
				}
			});
		}

      }
    };
  }]);

var mapStyles = [
  {
    "featureType": "landscape",
    "stylers": [
      { "color": "#EFEFEF" },
    ]
  },{
    "featureType": "landscape.man_made",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "poi",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "road",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
    "featureType": "water",
    "stylers": [
      { "color": "#FFFFFF" },
      { "lightness": 54 }
    ]
  },{
    "featureType": "administrative",
    "elementType": "labels",
    "stylers": [
      { "lightness": 26 }
    ]
  },{
    "featureType": "administrative",
    "elementType": "labels",
    "stylers": [
      { "visibility": "off" }
    ]
  },{
  }
];
