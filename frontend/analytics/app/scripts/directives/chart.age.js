'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.scatter.js
 * @description
 * # chart.scatter.js
 */
angular.module('analyticsApp')
	.directive('followers', function() {
		return {
			template: '<div class="ages" id="{{ id }}"></div>',
			restrict: 'E',
			scope: {
				data: "=",
				options: "=",
				selected: "=",
				modal: "=",
				labels: "="
			},
			link: function postLink(scope, element, attrs) {

				scope.options = scope.options || {};

				scope.id = "chart-" + Math.round(Math.random() * 10000);
				scope.$watch('data', function() {
					if (scope.data && scope.data.length > 0) {
						chart(scope.data);
					}
				});

				scope.$watch('options', function() {
					if (scope.data && scope.data.length > 0) {
						chart(scope.data);
					}
				}, true);

				var svg = null;
				var _def = function(option, def) {
					return option || def;
				}

				var chart = function(data) {

					var margin = {
							top: 30,
							right: 40,
							bottom: 30,
							left: 20
						},
						width = element.parent().width() - margin.left - margin.right,
						height = 200 - margin.top - margin.bottom;

					var x = d3.scale.linear()
					    .range([0, width]);

					var y = d3.scale.linear()
					    .range([height, 0]);

					var xAx = d3.scale.ordinal()
					    .range([0, width])
					    .domain(scope.labels);

					var xAxis = d3.svg.axis()
					    .scale(xAx)
					    .orient("bottom")
					    .ticks(2);

					var yAxis = d3.svg.axis()
					    .scale(y)
						.tickSize(width)
						.orient("right")
					    .ticks(5)
					    .tickFormat(function (d) { 
					    	console.log(d);
					    	return d + "%";
					    });

					var area = d3.svg.area()
					    .x(function(d) { return x(d.size - 1000); })
					    .y0(height)
					    .y1(function(d) { return y(d.percent); })
					    .interpolate("basis");

					var svg = d3.select("#" + scope.id).append("svg")
					    .attr("width", width + margin.left + margin.right)
					    .attr("height", height + margin.top + margin.bottom)
					  .append("g")
					    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				  x.domain(d3.extent(data, function(d) { return d.size - 1000; }));
				  y.domain([0, d3.max(data, function(d) { return d.percent; })]);


					d3.selection.prototype.last = function() {
					  var last = this.size() - 1;
					  return d3.select(this[0][last]);
					};


					d3.selection.prototype.first = function() {
					  return d3.select(this[0][0]);
					};

				  svg.append("path")
				      .datum(data)
				      .attr("class", "area")
				      .attr("d", area);

				  svg.append("g")
				      .attr("class", "x axis")
				      .attr("transform", "translate(0," + height + ")")
				      .call(xAxis)

				  svg.selectAll(".x.axis .tick").first().select("text").style("text-anchor", "start");
				  svg.selectAll(".x.axis .tick").last().select("text").style("text-anchor", "end");

				  svg.append("g")
				      .attr("class", "y axis")
				      .call(yAxis);

				  svg.selectAll(".y.axis .tick").last().remove();
				}

			}
		};
	});