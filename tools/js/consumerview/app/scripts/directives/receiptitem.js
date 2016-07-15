'use strict';

/**
 * @ngdoc function
 * @name consumerviewApp.directive:receiptitem
 * @description
 * # receiptitem
 * Directive to show the content of an item of a receipt
 */
angular.module('consumerviewApp')
.directive('receiptitem', function(){
  return {
    restrict: 'E',
    scope: {
      itemdata: '='
    },
    templateUrl: './scripts/directives/receiptitem.tpl.html'
  }
});
