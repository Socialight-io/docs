'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.scatter.js
 * @description
 * # chart.scatter.js
 */
angular.module('analyticsApp')
	.directive('timeday', function() {
		return {
			template: '<div class="timeday" id="{{ id }}"></div>',
			restrict: 'E',
			scope: {
				data: "=",
				options: "=",
				selected: "=",
				modal: "="
			},
			link: function postLink(scope, element, attrs) {

				scope.options = scope.options || {};

				scope.id = "chart-" + Math.round(Math.random() * 100000);

				scope.$watch('data', function() {
					if (scope.data && scope.data.length > 0) {
						chart(scope.data);
					}
				});

				var svg = null;
				var _def = function(option, def) {
					return option || def;
				}
				var chart = function(data) {

					var margin = {
							top: 0,
							right: 30,
							bottom: 40,
							left: 30
						},
						width = element.parent().width() - margin.left - margin.right,
						height = (scope.options.height || 400) - margin.top - margin.bottom;

					var parseDate = d3.time.format("%Y-%m-%d").parse;

					var x = d3.scale.linear()
						.range([0, width]);

					var y = d3.scale.linear()
						.range([height, 0]);

					var scale = d3.scale.linear()
						.range([0, 1])

					var scaleEng = d3.scale.linear()
						.range([0, (width/24)])

					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom")
						.tickFormat(function(d, i) {
							var ap = 'AM';
							if (d > 12) { 
								d = d - 12;
								ap = 'PM';
							} else if (d == 12) { 
								ap = 'PM';
							} else if (d == 0) { 
								d = 12;
							}
					        return d + ap;
					    });

					var yAxis = d3.svg.axis()
						.scale(y)
						.tickSize(width)
						.ticks(6)
						.orient("right")
						.tickFormat(function(d, i) {
							return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]
					    });

					var svg = d3.select("#" + scope.id).append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					x.domain([ 0, 24 ]);
					y.domain([ 0, 7 ]);

					scale.domain([
						d3.min(data, function(d) {
							return d.count;
						}),
						d3.max(data, function(d) {
							return d.count;
						})
					]);

					scaleEng.domain([
						d3.min(data, function(d) {
							return d.engagement;
						}),
						d3.max(data, function(d) {
							return d.engagement;
						})
					]);

					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + (height) + ")")
						.call(xAxis)
						.append("text")
						.attr("y", 20)
						.attr("x", 0);

					// var xText = svg.selectAll(".x.axis text")
					// 	.attr("y", 12);

					d3.selection.prototype.last = function() {
					  var last = this.size() - 1;
					  return d3.select(this[0][last]);
					};

					svg.selectAll(".x.axis line").remove();

					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("x", 0)
						.attr("dy", ".71em")
						.style("text-anchor", "start");

					var yText = svg.selectAll(".y.axis text")
						.attr("x", 4)
						.attr("dy", -4);

					svg.selectAll(".y.axis .tick").last().remove();

					var cityEng = svg.selectAll(".circle-eng")
						.data(data).enter()
						.append("circle")
						.attr("class", "circle-eng")
						.attr("data-account", function(d) {
							return "BOB";
						})
						.attr("cy", function(d) {
							return y(d.day) + (height / 7);
						})
						.attr("cx", function(d) {
							return x(d.hour);
						})
						.attr("r", function(d) { 
							return scaleEng(d.engagement);
						})
						.attr("width", function(d) {
							return width / 24;
						})
						.attr("height", function (d) { 
							return height / 7;
						})
						.style("fill", function(d) {
							return "#006699";
						})
						.style("opacity", function (d) {
							// return scaleEng(d.engagement); 
							return scale(d.count);
						})
						.style("stroke", function(d) {
							return "transparent";
						})
						.on("mouseover", function(d) {
							d3.selectAll(".circle").attr("data-fade", true);
							d3.selectAll("[data-account='"+d.user.name.alias+"']").attr("data-fade", false);
							d3.select(this).attr("data-fade", false);
						})
						.on("mouseout", function(d) {
							d3.selectAll(".circle").attr("data-fade", false);
						})
						.on("mousedown", function(d) {
							scope.$apply(function () { 
								scope.selected = d;
								scope.modal = true;
							});
						});
				}

			}
		};
	});