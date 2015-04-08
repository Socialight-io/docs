'use strict';

/**
 * @ngdoc service
 * @name analyticsApp.filters
 * @description
 * # filters
 * Service in the analyticsApp.
 */
angular.module('analyticsApp')
  .service('Filters', function () {

  	var data = { filters: {}, selected: {} };

  	data.filters.dates = [{
        label: "Last Seven Days",
        end: moment().add(1, "days").format("YYYY-MM-DD"),
        start: moment().subtract(7, "days").format("YYYY-MM-DD"),
        pre: moment().subtract(2, "months").format("YYYY-MM-DD")
      }, {
  			label: "This Month",
  			end: moment().add(2, "days").format("YYYY-MM-DD"),
  			start: moment(moment().format("YYYY-MM") + "-01").format("YYYY-MM-DD"),
  			pre: moment().subtract(2, "months").format("YYYY-MM-DD")
  		}, {
  			label: "Last 28 Days",
  			end: moment().add(2, "days").format("YYYY-MM-DD"),
  			start: moment().subtract(1, "months").format("YYYY-MM-DD"),
  			pre: moment().subtract(2, "months").format("YYYY-MM-DD")
  		}, {
  			label: "Last Three Months",
  			end: moment().add(4, "days").format("YYYY-MM-DD"),
  			start: moment().subtract(3, "months").format("YYYY-MM-DD"),
  			pre: moment().subtract(2, "months").format("YYYY-MM-DD")
  		}, {
  			label: "Last Six Months",
  			end: moment().add(7, "days").format("YYYY-MM-DD"),
  			start: moment().subtract(6, "months").format("YYYY-MM-DD"),
  			pre: moment().subtract(2, "months").format("YYYY-MM-DD")
  		}, {
  			label: "Last Twelve Months",
  			end: moment().add(12, "days").format("YYYY-MM-DD"),
  			start: moment().subtract(12, "months").format("YYYY-MM-DD"),
  			pre: moment().subtract(2, "months").format("YYYY-MM-DD")
  	}];

  	data.selected.dates = data.filters.dates[2];

  	return data;
  });
