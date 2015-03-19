'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.timeseries
 * @description
 * # chart.timeseries
 */
angular.module('analyticsApp')
  .directive('timeseries', function () {
    return {
      template: '<div id="{{ id }}"></div>',
      restrict: 'E',
      scope: {
      	data: "=",
      	options: "="
      },
      link: function postLink(scope, element, attrs) {

      	scope.options = scope.options || {};

      	scope.id = "chart-"+Math.round(Math.random()*10);
      	scope.$watch('data', function () { 
      		if (scope.data && scope.data.length > 0) { 
      			chart(scope.data);
      		}
      	});

      	scope.$watch('options', function () { 
      		if (scope.data && scope.data.length > 0) { 
      			chart(scope.data);
      		}
      	}, true);

      	var svg = null;
      	var _def = function (option, def) { return option || def; }
      	var chart = function (data) { 

	      	var margin = {top: 0, right: 0, bottom: 30, left: 0},
			    width = element.parent().width() - margin.left - margin.right,
			    height = (scope.options.height || 500) - margin.top - margin.bottom;

			var parseDate = d3.time.format("%Y-%m-%d").parse;

			var x = d3.time.scale()
			    .range([0, width]);

			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
    			.tickSize(width)
    			.ticks(5)
			    .orient("right");

			var line = d3.svg.line()
			    .interpolate("basis")
			    .x(function(d) { return x((d3.time.format("%Y-%m-%d").parse)(d.date.substr(0,7) + "-01")); })
			    .y(function(d) { return y(d[scope.options.y] || d.count); });

			d3.select("svg.timeseries").remove();

			var svg =  d3.select("#"+scope.id).append("svg")
				.attr("class", "timeseries")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			  x.domain([
			  	d3.min(data, function(d) { return d3.min(d.values, function (d) { return parseDate(d.date.substr(0,7) + "-01"); }); }),
			  	d3.max(data, function(d) { return d3.max(d.values, function (d) { return parseDate(d.date.substr(0,7) + "-01"); }); })
			  ]);
			  y.domain([
			  	d3.min(data, function(d) { return d3.min(d.values, function (d) { return d[scope.options.y] || d.count; }); }),
			  	d3.max(data, function(d) { return d3.max(d.values, function (d) { return d[scope.options.y] || d.count; }); })
			  ]);

			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("x", 20)
			      .attr("dy", ".71em")
			      .style("text-anchor", "start");

			 var yText = svg.selectAll(".y.axis text")
				    .attr("x", 4)
				    .attr("dy", -4);

			  var city = svg.selectAll(".city")
			      .data(data)
			    .enter().append("g")
			      .attr("class", "city");

			  city.append("path")
			      .attr("class", "line")
			      .attr("d", function(d) { return line(d.values); })
			      .style("fill", function(d) { return "transparent"; })
			      .style("stroke", function(d) { return d.color || "black"; })
			      .style("stroke-width", "2px");

			  city.append("text")
			      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
			      .attr("x", 3)
			      .attr("dy", ".35em")
			      .text(function(d) { return d.name; });
	      }

      }
    };
  });
