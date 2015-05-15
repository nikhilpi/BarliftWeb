'use strict';

/**
 * @ngdoc directive
 * @name barliftApp.directive:fullScroll
 * @description
 * # fullScroll
 */
angular.module('barliftApp')
  .directive('fullScroll', function ($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        $timeout(function(){
          element.slimscroll({
              height: '100%',
              railOpacity: 0.9
          });
        });
      }
    };
  });
