'use strict';

/**
 * @ngdoc filter
 * @name analyticsApp.filter:bnum
 * @function
 * @description
 * # bnum
 * Filter in the analyticsApp.
 */
angular.module('analyticsApp')
  .filter('num', function () {
    return function(input, dec) {

        if (input && typeof(input) == "number") {

            // This gets the number to be between 0-999
            var dv = 1; var l = "";

            if (input > 999 && input < 1000000) { var dv = 1000; var l = "k"; }
            else if (input > 999999 && input < 1000000000) { var dv = 1000000; var l = "M"; }
            else if (input > 1000000000 && input < 1000000000000) { var dv = 1000000000; var l = "B"; }

            var num = input / dv;

            // This adds decimals if it thinks it should
            if (dec) { var dc = Math.pow(10, dec); }
            else if (num < 1) { var dc = 100; }
            else if (num >= 1 && num < 10) { var dc = 10; }
            else if (num >= 10) { var dc = 1; }

            num = Math.round(num * dc) / dc;

            return num + l;
        } else { return "--"; }
    }
  });
