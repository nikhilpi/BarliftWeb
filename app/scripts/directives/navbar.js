'use strict';

/**
 * @ngdoc directive
 * @name barliftApp.directive:navBar
 * @description
 * # navBar
 */
angular.module('barliftApp')
  .directive('navBar', function () {
    return {
      templateUrl: 'views/navbar.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
