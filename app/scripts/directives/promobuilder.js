'use strict';

/**
 * @ngdoc directive
 * @name barliftApp.directive:promoBuilder
 * @description
 * # promoBuilder
 */
angular.module('barliftApp')
  .directive('promoBuilder', function (ParseTypes, $q, $state, $http, Deals, Invoice, Community) {
    return {
      templateUrl: 'views/dash/directives/promo-builder.html',
      restrict: 'E',
      scope:{
        deals: '=',
        user: '='
      },
      controller: function($scope, CloudCode){
        $scope.events = [];

        $scope.selectedDeals = [];

        $scope.eventSource = [$scope.events];

        $scope.total = 0;

        $scope.$watch('deals',function(){
          loadDeals()
        });

        function loadDeals(){
          angular.forEach($scope.deals, function(deal){
            var found = false;
            angular.forEach($scope.events, function(calEvent, index){
              if(angular.equals(calEvent.deal, deal)){
                found = true;
              } else if(calEvent.deal.objectId === deal.objectId){
                $scope.events.splice(index, 1);
              }
            });

            if(!found){
              var css = [];
              if(deal.main){
                css = ['main-event','unselectable-event'];
              } else if(!deal.eligible_main){
                css = ['past-event','unselectable-event'];
              }
              $scope.events.push({
                title: deal.name,
                editable: false,
                start: deal.deal_start_date,
                deal: deal,
                className: css
              });
            }
          });
        }

        function selectDeal(deal){
          CloudCode.call('pushCount', {community: deal.community_name}).then(
          function(num){
            deal.estPush = num.result;
            Community.query({where: {name: deal.community_name}}, function(com){
              com = com[0];
              deal.price = com.pricing[deal.deal_start_date.getDay()]/100;
              deal.main_price = num.result * com.pricing[deal.deal_start_date.getDay()]/100;
              $scope.total += num.result * com.pricing[deal.deal_start_date.getDay()]/100;
              $scope.selectedDeals.push(deal);
            })
          });
          
        };

        $scope.alertOnEventClick = function(event, allDay, jsEvent, view ){
          if(event.deal.eligible_main){
            if(!event.selected){
              event.selected = true;
              event.className.push('selected-event');
              selectDeal(event.deal);
            } else {
              event.selected = false;
              var cI = event.className.indexOf('selected-event');
              event.className.splice(cI,1);    
              var index = $scope.selectedDeals.indexOf(event.deal);
              $scope.selectedDeals.splice(index,1);
              $scope.total -= event.deal.main_price;
            }
          }
        };

        $scope.buyDeals = function(){

          var buys = [];
          angular.forEach($scope.selectedDeals, function(deal){
            deal.main = true;
            delete deal.__type;
            delete deal.className;
            buys.push(
              Deals.update(deal).$promise
            );

            var invoice = Invoice.newInvoice($scope.user);
            invoice.amount = deal.main_price;
            invoice.type = 'deal of day';
            invoice.description = {
              dealname: deal.name,
              dealid: deal.objectId
            };
            buys.push(
              Invoice.save(invoice).$promise
            );

          });
          $q.all(buys).then(function(){
              $scope.$emit('notify', {cssClass: 'alert-success', message:'Your deals of the day have been added to your invoice'});
              $state.go('profile.invoice');
          });
        };

        $scope.uiConfig = {
          calendar:{
            height: 450,
            editable: true,
            header: {
              left: '',
              center: 'title',
              right: 'today prev,next'
            },
            eventClick: $scope.alertOnEventClick
          }
        };


        

      },
      link: function postLink(scope, element, attrs) {
        

      }
    };
  });
