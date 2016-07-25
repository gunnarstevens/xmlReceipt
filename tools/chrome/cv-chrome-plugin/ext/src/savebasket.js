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

        var jsonReceipt = ReweComposer.getJsonReceipt(basket);
        // CVFireBase.saveBasket(jsonReceipt);
        chrome.runtime.sendMessage(jsonReceipt, function(response) {
            console.log("Get an callback: " + response);
        });

         var cvhook = $("#checkout_navigation_form_top");
         cvhook.after("<button type='button' id='consumerview' style='background-color: darkgreen; margin-right: 5px; color: lightyellow;'>In Verbrauchersicht</button>");

         $( "#consumerview" ).click(function() {
             ReweComposer.saveBasket(jsonReceipt, function  () {
                 alert( "Basket saved: " +  this.responseText );
             });
         });
     }
 }


