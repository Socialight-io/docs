'use strict';

/**
 * @ngdoc service
 * @name analyticsApp.Data
 * @description
 * # Data
 * Service in the analyticsApp.
 */
angular.module('analyticsApp')
  .service('Data', ['$http', function ($http) {
    var data = {
    	response: { },
    	config: { 
    		token: _config.group.token,
    		uid: _config.group.id
    	}
    };

    data.refresh = function (options, callback) { 
    	$http.get(_config.api + "/" + options.route +"/?" + options.url, { 
    		params: _.extend(data.config, options.params)
    	}).success( function (res) { 
    		callback(res);
    	}).error( function (err) {
    		console.log("There's an error");
    	});
    }

    return data;
}]);
