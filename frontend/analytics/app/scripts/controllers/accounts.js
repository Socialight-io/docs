'use strict';

/**
 * @ngdoc function
 * @name analyticsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the analyticsApp
 */
angular.module('analyticsApp')
  .controller('AccountsCtrl', ['$scope', 'Data', '$http', 'Filters', function ($scope, Data, $http, Filters) {

  	$scope.config = {
  		token: _config.group.token,
  		uid: _config.group.id
  	};

    $scope.filters = Filters;
    $scope.limit = 5;
    
    $scope.$watch("filters", function (d) { 
        $scope.init();
    }, true);

    $scope.diff = function (label, object) { 
      if (object && object[0] && object[1]) { 
        var dm = 30 / moment(object[0].created).format("D");
        var change = (object[0][label] * dm) - (object[1][label]);
        return (change / object[1][label]) * 100;
      } else { return "--"; }
    }

    $scope.showScatter = function (item) { 
      $('.circle').attr('data-fade', true);
      $('[data-account="'+item._id.user.name.alias+'"]').attr('data-fade', false);
    }

    $scope.hideScatter = function (item) { 
      $('.circle').attr('data-fade', false);
    }

  	$scope.init = function () { 


  		/* Main Metrics */
      $scope.summary = null;
    	$http.get(_config.api + "/posts/?created:mnth:g", { 
    		params: _.extend({}, $scope.config, { 
  				limit: -1,
  				"created:lt": $scope.filters.selected.dates.end,
  				"created:gt": $scope.filters.selected.dates.pre
  			})
    	}).success( function (res) { 
    		$scope.summary = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

  		/* Lists Metrics */
      $scope.list = null;
    	$http.get(_config.api + "/posts/?user:g", { 
    		params: _.extend({}, $scope.config, { 
  				limit: -1,
  				"created:lt": $scope.filters.selected.dates.end,
  				"created:gt": $scope.filters.selected.dates.start
  			})
    	}).success( function (res) { 
    		$scope.list = res;
    	}).error( function (err) {
    		console.log("There's an error");
    	});

      /* Top Posts */
      $scope.posts = null; $scope.scatter = null;
      $http.get(_config.api + "/posts/?meta.engagement:sd", { 
        params: _.extend({}, $scope.config, { 
          "limit": 500,
          "created:lt": $scope.filters.selected.dates.end,
          "created:gt": $scope.filters.selected.dates.start
        })
      }).success( function (res) { 
        $scope.posts = res;
        $scope.scatter = res;
      }).error( function (err) {
        console.log("There's an error");
      });

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
