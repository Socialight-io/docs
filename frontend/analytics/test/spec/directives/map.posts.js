'use strict';

describe('Directive: map.posts', function () {

  // load the directive's module
  beforeEach(module('analyticsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<map.posts></map.posts>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the map.posts directive');
  }));
});
