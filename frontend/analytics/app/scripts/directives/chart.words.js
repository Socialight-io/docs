'use strict';

/**
 * @ngdoc directive
 * @name analyticsApp.directive:chart.words
 * @description
 * # chart.words
 */
angular.module('analyticsApp')
	.directive('words', function() {
		return {
			template: '<div id="{{ id }}"></div>',
			restrict: 'E',
			scope: {
				data: "=",
				options: "=",
				selected: "=",
				modal: "="
			},
			link: function postLink(scope, element, attrs) {

				scope.$watch('data', function() {
					if (scope.data && scope.data.length > 0) {
						scope.init(scope.data);
					}
				});

				scope.id = "chart-" + Math.round(Math.random() * 10);

				scope.init = function() {

					var margin = {
							top: 0,
							right: 30,
							bottom: 100,
							left: 30
						},

					width = element.parent().width() - margin.left - margin.right,
					height = (400) - margin.top - margin.bottom;


					var x = d3.scale.ordinal()
						.rangeRoundBands([0, width], .1);

					var xEng = d3.scale.ordinal()
						.rangeRoundBands([0, width], .1);

					var colors = d3.scale.linear()
						.range([.5, 1]);

					var y = d3.scale.linear()
						.range([0, height]);

					var yEng = d3.scale.linear()
						.range([10, height]);

					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");

					var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left")
						.ticks(10, "%");

					d3.select("#" + scope.id + " svg").remove();

					var svg = d3.select("#" + scope.id).append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					x.domain(scope.data.map(function(d) {
						return d._id.words;
					}));

					y.domain([0, d3.max(scope.data, function(d) {
						return d.count;
					})]);

					yEng.domain([0, d3.max(scope.data, function(d) {
						return d.engagement;
					})]);

					colors.domain([0, d3.max(scope.data, function(d) {
						return d.engagement;
					})]);

					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis)
						.selectAll("text")
						    .attr("y", 0)
						    .attr("x", 20)
						    .attr("dy", ".35em")
						    .attr("transform", "rotate(90)")
						    .style("text-anchor", "start");

					svg.selectAll(".x.axis line").remove();

					var yax = svg.append("g")
						.attr("class", "y axis")
						.call(yAxis);

					yax.selectAll(".ticks text")
						.style("fill", "white");

					yax.append("text")
						.attr("transform", "rotate(90)")
						.attr("y", 6)
						.attr("x", (height / 2))
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("WORD FREQUENCY");

					yax.append("text")
						.attr("transform", "rotate(90)")
						.attr("y", 6)
						.attr("x", (height))
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("ENGAGEMENT");

					svg.selectAll(".y.axis .tick text").remove();
					svg.selectAll(".y.axis .tick line").remove();

					svg.selectAll(".bar")
						.data(scope.data)
						.enter().append("rect")
						.attr("class", "bar")
						.attr("x", function(d) {
							return x(d._id.words);
						})
						.attr("width", x.rangeBand())
						.attr("y", function(d) {
							return (height - y(d.count)) / 2;
						})
						.attr("height", function(d) {
							return (y(d.count)) / 2;
						})
						.style("fill", function (d) { 
							return "#006699";
						})
						.style("opacity", function (d) { 
							return colors(d.engagement);
						});

					svg.append("g")
						.attr("class", "bars")
						.attr("y", 10)
						.selectAll(".bar2")
						.data(scope.data)
						.enter().append("rect")
						.attr("class", "bar2")
						.attr("x", function(d) {
							return x(d._id.words);
						})
						.attr("width", x.rangeBand())
						.attr("y", function(d) {
							return ((height - yEng(d.engagement)) / 2) + (height / 2) + 10;
						})
						.attr("height", function(d) {
							return ((yEng(d.engagement) - 20) / 2) + 10;
						})
						.style("fill", function (d) { 
							return "#006699";
						})
						.style("opacity", function (d) { 
							return colors(d.engagement);
						});

				}
			}
		};
	});