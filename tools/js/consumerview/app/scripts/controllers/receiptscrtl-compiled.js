"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * @ngdoc function
 * @name ReceiptsCtrl
 * @description
 * # ReceiptsCtrl
 * Controller of the consumerviewApp
 */

var ReceiptsCtrl = function ReceiptsCtrl($scope, receiptsFactory) {
  receiptsFactory.async().then(function (d) {
    $scope.receipts = d;
  });
};

exports.ReceiptsCtrl = ReceiptsCtrl;

//# sourceMappingURL=receiptscrtl-compiled.js.map