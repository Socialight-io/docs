'use strict';

describe('Directive: chart.timeseries', function () {

  // load the directive's module
  beforeEach(module('analyticsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chart.timeseries></chart.timeseries>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the chart.timeseries directive');
  }));
});
