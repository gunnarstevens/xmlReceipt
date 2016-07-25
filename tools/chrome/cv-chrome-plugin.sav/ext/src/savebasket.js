var scripts = $('script');
for(i=0; i < scripts.length; i++) {
     var script = scripts.get(i);
     var content = script.text;
     if(content.indexOf('var pageData') != -1){

         start = content.indexOf('=')+2;
         end = content.indexOf(';');
         var jsstr = content.substr(start, end-start);

         var basket = $.parseJSON(jsstr);
         console.log('Basket: products=' + basket.products.length);

 //        var jsonReceipt = ReweComposer.getJsonReceipt(basket);
 //        CVFireBase.saveBasket(jsonReceipt);
 //        chrome.runtime.sendMessage(jsonReceipt, function(response) {
 //            console.log("Get an callback: " + response);
 //        });

         var cvhook = $("#checkout_navigation_form_top");
         cvhook.after("<div id='consumerview' style='background-color: #006600; color: lightyellow; padding: 5pt; margin-top: 3px; font-family: Arial, sans-serif'>Einkauf in Verbrauchersicht ansehen</div>");
     }
 }


