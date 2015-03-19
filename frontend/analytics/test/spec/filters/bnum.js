'use strict';

describe('Filter: bnum', function () {

  // load the filter's module
  beforeEach(module('analyticsApp'));

  // initialize a new instance of the filter before each test
  var bnum;
  beforeEach(inject(function ($filter) {
    bnum = $filter('bnum');
  }));

  it('should return the input prefixed with "bnum filter:"', function () {
    var text = 'angularjs';
    expect(bnum(text)).toBe('bnum filter: ' + text);
  });

});
