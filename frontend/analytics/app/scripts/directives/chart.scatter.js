'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.scatter.js
 * @description
 * # chart.scatter.js
 */
angular.module('analyticsApp')
	.directive('scatter', function() {
		return {
			template: '<div class="scatter" id="{{ id }}"></div>',
			restrict: 'E',
			scope: {
				data: "=",
				options: "=",
				selected: "=",
				modal: "="
			},
			link: function postLink(scope, element, attrs) {

				scope.options = scope.options || {};

				scope.id = "chart-" + Math.round(Math.random() * 10);
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
							right: 0,
							bottom: 30,
							left: 0
						},
						width = element.parent().width() - margin.left - margin.right,
						height = (scope.options.height || 400) - margin.top - margin.bottom;

					var parseDate = d3.time.format("%Y-%m-%d").parse;

					var x = d3.time.scale()
						.range([0, width]);

					var y = d3.scale.linear()
						.range([height, 0]);

					var scale = d3.scale.linear()
						.range([5, 80])

					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");

					var yAxis = d3.svg.axis()
						.scale(y)
						.tickSize(width)
						.ticks(6)
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
					    })
						.orient("right");

					d3.select("#" + scope.id + " svg").remove();

					var svg = d3.select("#" + scope.id).append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					x.domain([
						d3.min(data, function(d) {
							return moment.utc(d.created.substr(0, 10)).subtract("1", "days").toDate();
						}),
						d3.max(data, function(d) {
							return moment.utc(d.created.substr(0, 10)).add("1", "days").toDate();
						})
					]);

					y.domain([
						d3.min(data, function(d) {
							return 1 * d3.time.format("%H")(d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(d.created));
						}),
						d3.max(data, function(d) {
							return 1 * d3.time.format("%H")(d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(d.created));
						})
					]);

					scale.domain([
						d3.min(data, function(d) {
							return d.meta ? d.meta.engagement : 0;
						}),
						d3.max(data, function(d) {
							return d.meta ? d.meta.engagement : 0;
						})
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

					var city = svg.selectAll(".circle")
						.data(data).enter()
						.append("circle")
						.attr("class", "circle")
						.attr("data-account", function(d) {
							return d.user.name.alias;
						})
						.attr("cy", function(d) {
							return y(d3.time.format("%H")(d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse(d.created)));
						})
						.attr("cx", function(d) {
							return x(moment.utc(d.created.substr(0, 10)).toDate());
						})
						.attr("r", function(d) {
							return scale(d.meta ? d.meta.engagement : 0);
						})
						.style("fill", function(d) {
							return d.user.color;
						})
						.style("stroke", function(d) {
							return "transparent";
						})
						.style("opacity", .5)
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