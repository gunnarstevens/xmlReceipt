'use strict';

/**
 * @ngdoc function
 * @name consumerviewApp.controller:ReceiptsCtrl
 * @description
 * # ReceiptsCtrl
 * Controller of the consumerviewApp
 */
angular.module('consumerviewApp')
  .controller("ReceiptsCtrl", function($scope, receiptsFactory) {
       receiptsFactory.async().then(function(d){
           $scope.receipts = d;
       });
   });


