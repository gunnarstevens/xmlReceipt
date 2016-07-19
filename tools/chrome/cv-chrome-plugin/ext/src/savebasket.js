debugger;
var scripts = $('script')

for(i=0; i < scripts.length; i++) {
     var script = scripts.get(i);
     var content = script.text;
     if(content.indexOf("var pageData") != -1){
         console.log("end");
         chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
             console.log("Get an callback: " + response.farewell);
         });
     }
 }
console.log('Save Rewe Basket: END');


