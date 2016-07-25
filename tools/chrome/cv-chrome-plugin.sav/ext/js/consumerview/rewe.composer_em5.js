var ReweComposer = (function () {
    function ReweComposer() {
    }
    ReweComposer.getJsonReceipt = function (reweBasket) {
        var xmlreceipt = this.getTemplate();
        // 1. seller is set by default
        // 2. add item info into the receipt template
        for (var item in reweBasket.products) {
            xmlreceipt.itemlist.item.push(this.getReceiptItem(reweBasket.products[item]));
        }
        // 3. add total cost
        xmlreceipt.total.purchasedate = this.format(new Date());
        xmlreceipt.total.totalprice = reweBasket.basket.totalBasketValue;
        xmlreceipt.total.totalquantity = reweBasket.basket.totalUnits;
        return xmlreceipt;
    };
    ReweComposer.getTemplate = function () {
        var xmlreceipt = ({
            "seller": {
                "selleraddress": "http://shop.rewe.de",
                "sellerid": {
                    "sellerid": "rewe:231007"
                },
                "sellername": "REWE Online",
                "uri": "www.rewe.de"
            },
            "itemlist": {
                "item": []
            },
            "total": {
                "purchasedate": "<undefined>",
                "totalprice": {
                    "currency": "EUR",
                    "totalnetvalue": "<undefined>"
                },
                "totalquantity": {
                    "totalProducts": "<undefined>",
                    "totalUnits": "<undefined>"
                }
            }
        });
        return xmlreceipt;
    };
    ReweComposer.format = function (d) {
        return d.getUTCFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "+" + d.getHours() + ":" + d.getMinutes();
    };
    ReweComposer.getReceiptItem = function (basketItem) {
        var item = ({
            "itemid": {
                "selleritemid": "<undefined>"
            },
            "itemname": "<undefined>",
            "price": {
                "currency": "EUR",
                "itemvalue": "<undefined>"
            },
            "itemgroup": {
                "sellercategory": {
                    "classificationname": "<undefined>",
                    "language": "DE-de"
                }
            },
            "aspect": {
                "aspectname": "iconurl",
                "aspectvalue": "<undefined>"
            }
        });
        item.itemid.selleritemid = "rewe:" + basketItem.id;
        item.itemname = basketItem.name;
        item.itemgroup.sellercategory.classificationname = basketItem.category;
        item.aspect.aspectvalue = $('a[href="/PD' + basketItem.id + '"] img').attr("src");
        return item;
    };
    return ReweComposer;
}());

var CVFireBase = (function () {
    function CVFireBase() {
    }
    CVFireBase.saveBasket = function (jsonBasket) {
        var RECEIPTS_PATH = "/anonymous/receipts";
        var config = {
            apiKey: "AIzaSyD5plOi9OhTJnLF-3sfbqLtcn94xcIcXa4",
            authDomain: "consumerview.firebaseapp.com",
            databaseURL: "https://consumerview.firebaseio.com",
            storageBucket: "firebase-consumerview.appspot.com"
        };
        firebase.initializeApp(config);
        var receipts = firebase.database.list(RECEIPTS_PATH);
        var key = receipts.push().set(jsonBasket);
        console.log("Receipt Service add: receipt: " + jsonBasket + ", key: " + key);
    };
    return CVFireBase;
}());
