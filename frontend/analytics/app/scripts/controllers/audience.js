'use strict';

/**
 * @ngdoc function
 * @name analyticsApp.controller:AudienceCtrl
 * @description
 * # AudienceCtrl
 * Controller of the analyticsApp
 */
angular.module('analyticsApp')
  .controller('AudienceCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.config = {
        token: _config.group.token,
        uid: _config.group.id
    };

    $scope.diff = function (label, object) { 
        if (object &&object[0] && object[1]) { 
          var dm = 30 / moment(object[0].created).format("D");
          var change = (object[0][label] * dm) - (object[1][label]);
          return (change / object[1][label]) * 100;
        } else { 
            return "--";
        }
    }

    $scope.activityLabels = ["Less Active", "Very Active"];
    $scope.influenceLabels = ["Less Influence", "Very Influential"];

    $scope.init = function () { 

        /* Main Metrics */

        $http.get(_config.api + "/friends/?engagement.followers:sd&location.place:gt=0", { 
            params: _.extend({}, $scope.config, { 
                "limit": 1000,
                "created:lt": moment().format("YYYY-MM-DD"),
                "created:gt": moment().subtract(1, "months").format("YYYY-MM-DD")
            })
        }).success( function (res) {
            $scope.pins = res;
            if ($scope.pins.length == 0) { 
                $scope.noLocationData = true;
            }
        }).error( function (err) {
            console.log("There's an error");
        });

        $http.get(_config.api + "/friends/?engagement.followers:sd", { 
            params: _.extend({}, $scope.config, { 
                "limit": 500,
                "created:lt": moment().format("YYYY-MM-DD"),
                "created:gt": moment().subtract(1, "months").format("YYYY-MM-DD")
            })
        }).success( function (res) {
            var sizes = _.groupBy(res, function (d) { 
                return Math.round( (d.engagement.followers + 500) / 1000 ) * 1000;
            });

            sizes = _.map(sizes, function (d, i) { 
                return { 
                    data: d,
                    count: d.length,
                    size: i,
                    percent: (d.length / res.length) * 100
                }
            });

            var posts = _.groupBy(res, function (d) { 
                return Math.round( (d.engagement.posts + 500) / 1000 ) * 1000;
            });

            posts = _.map(posts, function (d, i) { 
                return { 
                    data: d,
                    count: d.length,
                    size: i,
                    percent: (d.length / res.length) * 100
                }
            });

            sizes = _.values(sizes).slice(0, 10);
            posts = _.values(posts).slice(0, 10);

            $scope.sizes = sizes;
            $scope.posts = posts;

        });


        // /* Lists Metrics */

        $http.get(_config.api + "/accounts/?uid:g", { 
            params: _.extend({}, $scope.config, {})
        }).success( function (res) { 
            $scope.summary = res;
        }).error( function (err) {
            console.log("There's an error");
        });

        /* Countries Metrics */

        $http.get(_config.api + "/friends/?location.country:g&count:sd", { 
            params: _.extend({}, $scope.config, {})
        }).success( function (res) { 

            res.shift();
            var total = _.reduce(res, function(d, e) { 
                return d + e.count;
            },0);

            $scope.countries = _.map(res, function (d) { 
                d.percent = (d.count / total) * 100;
                return d;
            });

        }).error( function (err) {
            console.log("There's an error");
        });

        /* States Metrics */

        $http.get(_config.api + "/friends/?location.administrative_area_level_1:g&count:sd", { 
            params: _.extend({}, $scope.config, { "location.country": "United States"})
        }).success( function (res) { 
            var total = _.reduce(res, function(d, e) { 
                return d + e.count;
            },0);

            $scope.states = _.map(res, function (d) { 
                d.percent = (d.count / total) * 100;
                d.state = d._id.location_administrative_area_level_1;
                return d;
            });

        }).error( function (err) {
            console.log("There's an error");
        });

        /* Gender Metrics */

        $http.get(_config.api + "/friends/?gender:g:in=male,female&count:sd", { 
            params: _.extend({}, $scope.config, {})
        }).success( function (res) { 
            
            var output = {};

            var total = _.reduce(res, function (d, e) { return d + e.count; }, 0);
            _.each(res, function (d) { 
                d.percent = d.count * 100 / total;
                output[d._id.gender] = d;
            });

            console.log(output);

            $scope.gender = output;
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
        }[d.data._id.service_name] + " (" + Math.round(d.data.engagement * 10000) / 100 + "%)";
    }

    $scope.typeLabels = function (d) { 
        return {
            'multi': 'Multi',
            'text': 'Text',
            'video': 'Video',
            'photo': 'Photo'
        }[d.data._id.type] + " (" + Math.round(d.data.engagement * 10000) / 100 + "%)";
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
