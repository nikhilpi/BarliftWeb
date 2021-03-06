'use strict';

/**
 * @ngdoc directive
 * @name viewsApp.directive:dealcard
 * @description
 * # dealcard
 */
angular.module('barliftApp')
  .directive('dealCard', function ($modal, Deals, $rootScope, Venues) {
    return {
      templateUrl: 'views/dash/directives/deal-card.html',
      restrict: 'E',
      scope: {
        deal: '=',
        openFeedback: '&'
      },
      link: function postLink(scope, element, attrs) {
      	scope.today = new Date();
        scope.venue = {};

        Venues.get({objectId: scope.deal.venue}, function(res){
          scope.venue = res;
        })

      	scope.sameDate = function(aDate, bDate) {
            return moment(aDate).dayOfYear() === moment(bDate).dayOfYear()
        };

        scope.pastDate = function(aDate, bDate) {
            return moment(aDate).dayOfYear() < moment(bDate).dayOfYear()
        };

        scope.isLocked = function(dealDate) {
            var lockDate = moment().endOf('day').add(3, 'day');
            return moment(dealDate).isBetween(moment().startOf('day'), lockDate);
        };

        scope.delete = function(){
          Deals.delete(scope.deal).$promise.then(
            function(res){
              $rootScope.$broadcast('deals-update', {query: {}});
              scope.$emit('notify', {cssClass: 'alert-success', message:'Your Deal has been deleted'});
              $state.go('deals.list');
            },
            function(err){
              scope.alert.text = err.data.error;
            });
        };

        scope.open = function () {
          var modalInstance = $modal.open({
            templateUrl: 'views/dash/directives/deal-repeat-modal.html',
            resolve: {
              deal: function () {
                return scope.deal;
              }
            },
            controller: function($scope, $modalInstance, deal, $state, Deals){
              $scope.selectedDeal = deal;
              $scope.newThings = {date: new Date()};
              $scope.today = moment().format('YYYY-MM-DD');

              $scope.dup = function () {
                $state.go('deals.builder',{selectedDeal: deal.objectId, dup: true})
                $modalInstance.close();
              };

              $scope.repeat = function () {
                var newDeal = angular.copy($scope.selectedDeal);
                newDeal.objectId = null;
                newDeal.num_accepted = 0;
                newDeal.whos_going = [];
                newDeal.main = false;
                var newDoY = moment($scope.newThings.date).dayOfYear();
                var oldDoY = moment($scope.selectedDeal.deal_start_date).dayOfYear();
                var diff = newDoY - oldDoY;
                newDeal.deal_start_date = moment(newDeal.deal_start_date).add(diff, 'days').toDate();
                newDeal.deal_end_date = moment(newDeal.deal_end_date).add(diff, 'days').toDate();
                Deals.save(newDeal).$promise.then(
                function(res){
                  $scope.$emit('deals-update',{query: {}});
                  $scope.$emit('notify', {cssClass: 'alert-success', message:'Your Deal has been added'});
                  $modalInstance.close();
                },
                function(err){
                  scope.alert.text = err.data.error;
                });
              };


              $scope.cancel = function () {
                  $modalInstance.dismiss('cancel');
              };
            }
          });
        };

      }
    };
  });
