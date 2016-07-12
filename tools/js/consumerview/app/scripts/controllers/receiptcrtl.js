'use strict';

/**
 * @ngdoc function
 * @name consumerviewApp.controller:ReceiptsCtrl
 * @description
 * # ReceiptsCtrl
 * Controller of the consumerviewApp
 */
angular.module('consumerviewApp')
  .controller('ReceiptsCtrl', function($scope, receiptsFactory) {
       receiptsFactory.async().then(function(d){
           $scope.receipts = d;
       });
   });




// Falls ein Service konfiguriert werden muss, definiere ihn als Provider und konfiguriere ihn im config-Callback, wie hier:
receiptApp.factory('receiptsFactory', function($http, x2js) {
  // TODO The $q service
  // The $q service of Angular is modelled on the lines of ES6 promises, though not all of the supporting methods from ES6 Harmony promises are available yet.
  // Check out the documentation of the $q service for more details at https://docs.angularjs. org/api/ng/service/$q.

  var myFactory = {
    async: function()
    {

      //TODO load from database
      var promise = $http.get('./data/receipt1.xml').then(function(response)
      {
        var jsreceipt = x2js.xml_str2json(response.data);

        //TODO maybe use a filter
        // https://github.com/mgechev/angularjs-style-guide/blob/master/README-de-de.md
        // Wenn du Daten formatieren musst, kapsle die Formatierungslogik in einem Filter und gebe diesen als Abhängigkeit an:
        //
        // module.filter('myFormat', function() {
        //     return function() {
        //         // body
        //     };
        // });
        //
        // module.controller('MyCtrl', ['$scope', 'myFormatFilter', function($scope, myFormatFilter) {
        //     // body
        // }]);
        var items = jsreceipt.xmlreceipt.itemlist.item;
        for (var i = 0; i < items.length; i++) {
          //TODO check that aspectname == "iconurl"
          items[i].itemimage = items[i].aspect.aspectvalue;
        }


        return [ jsreceipt ];
      });
      return promise;
    }
  };
  return myFactory;
});

// TODO https://github.com/mgechev/angularjs-style-guide/blob/master/README-de-de.md
// Verwende scope statt $scope in deiner Link-Funktion.
//     In den Compile- und Post-/Pre-Link-Funktionen hast du bereits Argumente angegeben, die verwendet werden sobald die Funktion aufgerufen wird. Diese kannst du nicht über eine Dependency Injection ändern. Dieser Stil wird auch im AngularJS-Sourcecode verwendet.
//     Verwende eigene Präfixe für deine Direktiven, um Namenskollisionen mit Bibliotheken von Drittanbietern zu vermeiden.
// Verwende einen Isolated Scope, wenn du wiederverwendbare Komponenten entwickelst.
//     Binde Direktiven über Attribute oder Elemente ein statt über Kommentare oder Klassen. Das macht deinen Code lesbarer.
//     Verwende zum Aufräumen $scope.$on('$destroy', fn). Dies ist besonders nützlich wenn du Wrapper-Direktiven für Drittanbieter-Plug-ins entwickelst.
//     Vergiss nicht, $sce zu verwenden, wenn du mit Inhalten arbeitest, die nicht vertrauenswürdig sind.

// we refer to this directive in our HTML elements in one of the following ways:
// my-directive, my_directive, or my:directive
// We can further pre x these names with either data- or x-.
// The best practice is to use the dash-delimited format, for example, my-directive.

receiptApp.directive('receiptitem', function(){
  return {
    restrict: 'E',
    scope: {
      itemdata: '='
    },
    templateUrl: './views/receiptitem.tpl.html'
  }
})

//TODO Filter
// Halte deine Filter so schlank wie möglich.
// Durch die $digest-Schleife werden sie häufig aufgerufen, so dass langsame Filter die gesamte Anwendung verlangsamen.
//     Mache nur eine einzige Sache in deinen Filtern, halte sie kohärent.
// Komplexere Manipulationen können erzielt werden, indem mehrere Filter gepiped werden.
