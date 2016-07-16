/* */ 
"use strict";
var mergeMap_1 = require('./mergeMap');
function concatMap(project, resultSelector) {
  return this.lift(new mergeMap_1.MergeMapOperator(project, resultSelector, 1));
}
exports.concatMap = concatMap;
