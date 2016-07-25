"use strict";
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
    ReweComposer.saveBasket = function (jsonReceipt, reqListener) {
        var xhr = new XMLHttpRequest();
        var dbobj = { "xmlreceipt": jsonReceipt };
        xhr.open("POST", "https://consumerview.firebaseio.com/anonymous/receipts.json", true);
        xhr.send(JSON.stringify(dbobj));
        xhr.addEventListener("load", reqListener);
    };
    return ReweComposer;
}());
exports.ReweComposer = ReweComposer;
//# sourceMappingURL=rewe.composer.js.map