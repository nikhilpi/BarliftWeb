'use strict';

/**
 * @ngdoc function
 * @name barliftApp.controller:PromoteviewCtrl
 * @description
 * # PromoteviewCtrl
 * Controller of the barliftApp
 */
angular.module('barliftApp')
  .controller('PromoteviewCtrl', function ($scope, AuthService, User, CloudCode, ParseTypes) {
    $scope.logout = AuthService.logout;
    $scope.deals = [];
    $scope.user = {};
    User.getCurrent(function(res){ 
      $scope.user = res; 
    });

    CloudCode.call('possibleMainDeals', {}).then(
      function(res){
        var processed = res.result.map(function(x){
          return ParseTypes.resProcess(x,'Deal');
        });
        $scope.deals = processed;
      });
    

  });
