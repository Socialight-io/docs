'use strict';

/**
 * @ngdoc function
 * @name analyticsApp.controller:ContentCtrl
 * @description
 * # ContentCtrl
 * Controller of the analyticsApp
 */
angular.module('analyticsApp')
  .controller('ContentCtrl', ['$scope', '$http', function ($scope, $http) {
  	$scope.config = {
  		token: _config.group.token,
  		uid: _config.group.id
  	};

    $scope.diff = function (label, object) { 
      var dm = 30 / moment(object[0].created).format("D");
      var change = (object[0][label] * dm) - (object[1][label]);
      return (change / object[1][label]) * 100;
    }

  	$scope.init = function () { 

  		/* Main Metrics */

    	$http.get(_config.api + "/posts/?words:u:g&count:sd", { 
    		params: _.extend({}, $scope.config, { 
  				"created:lt": moment().format("YYYY-MM-DD"),
  				"created:gt": moment().subtract(1, "months").format("YYYY-MM-DD")
  			})
    	}).success( function (res) { 
    		$scope.words = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

  		// /* Lists Metrics */

    	$http.get(_config.api + "/posts/?created:mnth:g", { 
    		params: _.extend({}, $scope.config, { 
  				"created:lt": moment().format("YYYY-MM-DD"),
  				"created:gt": moment().subtract(2, "months").format("YYYY-MM-DD")
  			})
    	}).success( function (res) { 
    		$scope.summary = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

    	$http.get(_config.api + "/posts/?meta.voice:g", { 
    		params: _.extend({}, $scope.config, { 
  				"created:lt": moment().format("YYYY-MM-DD"),
  				"created:gt": moment().subtract(2, "months").format("YYYY-MM-DD")
  			})
    	}).success( function (res) { 
    		$scope.voice = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

    	$http.get(_config.api + "/posts/?type:g", { 
    		params: _.extend({}, $scope.config, { 
  				"created:lt": moment().format("YYYY-MM-DD"),
  				"created:gt": moment().subtract(2, "months").format("YYYY-MM-DD")
  			})
    	}).success( function (res) { 
    		$scope.posttype = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

    	$http.get(_config.api + "/posts/?service.name:g", { 
    		params: _.extend({}, $scope.config, { 
  				"created:lt": moment().format("YYYY-MM-DD"),
  				"created:gt": moment().subtract(2, "months").format("YYYY-MM-DD")
  			})
    	}).success( function (res) { 
    		$scope.platform = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

      $http.get(_config.api + "/posts/?meta.engagement:sd", { 
        params: _.extend({}, $scope.config, { 
          "limit": 500,
          "created:lt": moment().format("YYYY-MM-DD"),
          "created:gt": moment().subtract(28, "days").format("YYYY-MM-DD")
        })
      }).success( function (res) { 

		var hourDay = _.groupBy(res, function(d) { 
			return moment.utc(d.created).format("H-E");
		});

		_.each(hourDay, function (d, i) { 
			var h = i.split("-");
			hourDay[i] = { 
				hour: h[0],
				day: h[1],
				data: d,
				count: d.length,
				sentiment: _.reduce(d, function (f, g) { return f + (g.meta ? g.meta.engagement : 0); }, 0) / d.length,
				engagement: _.reduce(d, function (f, g) { return f + (g.meta ? g.meta.sentiment : 0); }, 0) / d.length
			}
		});

		console.log(hourDay);
		$scope.hourday = _.values(hourDay);

      }).error( function (err) {
        console.log("There's an error");
      });

  	}

  	$scope.platformLabels = function (d) { 
  		return {
  			'twitter': 'Twitter', 
  			'facebook': 'Facebook',
  			'instagram': 'Instagram',
  			'facebookpage': 'FB Page' 
  		}[d.data._id.service_name];
  	}

   	$scope.typeLabels = function (d) { 
  		return {
  			'multi': 'Multi',
  			'text': 'Text',
  			'video': 'Video',
  			'photo': 'Photo'
  		}[d.data._id.type];
  	}

  	var mapUsers = function (series, metric) { 

  		var groups = {};

  		_.each(series, function (d) { 
  			groups[d._id.user.service.sid] = groups[d._id.user.service.sid] || {
  				color: d._id.user.color || "#000",
  				key: d._id.user.name.full || d._id.user.name.alias,
  				values: []
  			};

  			groups[d._id.user.service.sid].values.push(d);
  		});

  		_.each(groups, function (d, i) { 
  			groups[i].values.sort(function (d, e) { 
  				return new Date(d.date) - new Date(e.date);
  			});
  		});

  		return _.values(groups);
  	}
    
  	$scope.init();

  }]);
