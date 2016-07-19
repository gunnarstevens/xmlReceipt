export class ReweComposer {


    constructor() {}


    getJsonReceipt(reweBasket: any) : any {
        var xmlreceipt = this.getTemplate();
        // 1. seller is set by default

        // 2. add item info into the receipt template
        for (var item in reweBasket.products) {
            xmlreceipt.itemlist.item.push(this.getReceiptItem(item));
        }

        // 3. add total cost
        xmlreceipt.total.purchasedate = this.format(new Date());
        xmlreceipt.total.totalprice = reweBasket.basket.totalBasketValue;
        xmlreceipt.total.totalquantity = reweBasket.basket.totalUnits;

        return xmlreceipt;
    }

    getTemplate() : any {
        var xmlreceipt = ( {
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
    }

    format(d : Date) : string {
       return d.getUTCFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "+" + d.getHours() + ":" + d.getMinutes();
    }

    getReceiptItem(basketItem : any) : Object {
        var item = ({
                "itemid" : {
                    "selleritemid" : "<undefined>"
                },
                "itemname" : "<undefined>",
                "price" : {
                    "currency" : "EUR",
                    "itemvalue" : "<undefined>"
                },
            "itemgroup" : {
                "sellercategory" : {
                    "classificationname" : "<undefined>",
                    "language" : "DE-de"
                }
            },
            "aspect" : {
                    "aspectname" : "iconurl",
                    "aspectvalue" : "<undefined>"
                }
            });

        item.itemid.selleritemid = "rewe:" + basketItem.id;
        item.itemname = basketItem.name;
        item.itemgroup.sellercategory.classificationname = basketItem.category;
        item.aspect.aspectvalue = this.getItemImage(basketItem.id);

        return item;
    }

    getItemImage(itemid : string) : string {
        var result : string;
        result = "TODO make some jQuery stuff";
        return result;
    }
}
