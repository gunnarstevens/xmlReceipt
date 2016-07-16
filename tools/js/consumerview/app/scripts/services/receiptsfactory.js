'use strict';

/**
 * @ngdoc function
 * @name consumerviewApp.factory:receiptsFactory
 * @description
 * # receiptsFactory
 * Factory to load receipts from the database
 */
angular.module('consumerviewApp')
  .factory('receiptsFactory', function($http, x2js) {
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

