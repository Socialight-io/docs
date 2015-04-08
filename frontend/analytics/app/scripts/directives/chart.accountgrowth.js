'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.accountGrowth
 * @description
 * # chart.accountGrowth
 */
 angular.module('analyticsApp')
 .directive('growth', function () {
 	return {
 		template: '<div id="{{ id }}"></div>',
 		restrict: 'A',
 		scope: {
 			data: "="
 		},
 		link: function postLink(scope, element, attrs) {

			scope.$watch('data', function() {
				if (scope.data && scope.data.length > 0) {
					scope.init(scope.data);
				}
			});

			scope.id = "chart-" + Math.round(Math.random() * 100000);

			scope.init = function(data) {

				var margin = {
						top: 0,
						right: 0,
						bottom: 20,
						left: 0
					},

				width = element.parent().width() - margin.left - margin.right,
				height = (400) - margin.top - margin.bottom;
				
				var x = d3.time.scale()
				    .range([0, width]);

				var y = d3.scale.linear()
					.range([0, height]);

				var xAxis = d3.svg.axis()
				    .scale(x)
				    .orient("bottom");

				var yAxis = d3.svg.axis()
					.scale(y)
					.tickSize(width)
					.ticks(6)
					.tickFormat(function(d, i) {
				        return (Math.round(d * 10000) / 100) + "%";
				    })
					.orient("right");

				var line = d3.svg.line()
				    .x(function(d) { return x(d.date); })
				    .y(function(d) { return y(d.engagement); });

				var area = d3.svg.area()
				    .x(function(d) { return x(d.date); })
				    .y0(height)
				    .y1(function(d) { return y(d.engagement); })
				    .interpolate("basis");

				d3.select("#" + scope.id + " svg").remove();

				var svg = d3.select("#" + scope.id).append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				x.domain([
					d3.min(data, function (d) { return d3.min(d, function (e) { return e.date; })}),
					new Date()
				]);

				y.domain([
					d3.max(data, function (d) { return d3.max(d, function (e) { return e.engagement * 1.3; })}),
					d3.min(data, function (d) { return d3.min(d, function (e) { return 0; })})
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
					.attr("x", 14)
					.attr("dy", -4);


				_.each(data, function (d, i) { 

					// svg.append("path")
					//   .datum(d)
					//   .attr("class", "line")
					//   .attr("fill", "transparent")
					//   .attr("stroke", function (d) { 
					//   	return d[0]._id.user.color;
					//   })
					//   .attr("stroke-width", "3")
					//   .attr("d", line);

					// svg.selectAll(".circ" + i)
					// 	.data(d).enter()
					// 	.append("circle")
					// 	.attr("class", "circ" + i)
					// 	.attr("cy", function(d) {
					// 		return y(d.engagement);
					// 	})
					// 	.attr("cx", function(d) {
					// 		return x(d.date);
					// 	})
					// 	.attr("r", function(d) {
					// 		return 5;
					// 	})
					// 	.style("fill", function(d) {
					// 		return d._id.user.color;
					// 	})
					// 	.style("stroke", "white")
					// 	.style("stroke-width", 2);

					svg.append("path")
						.datum(d)
						.attr("class", "area area" + i)
						.attr("data-account", function (co) { return d[0]._id.user.name.alias; })
						.attr("d", area)
						.style("fill", function(co) {
							return d[0]._id.user.color;
						})
						.style("opacity", .5);
					});
 			}
 		}
 	};
 });
