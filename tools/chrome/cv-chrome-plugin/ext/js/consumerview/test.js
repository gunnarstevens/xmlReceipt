
var testreceipt = ({
    "products": [
        {
            "id": "72773",
            "name": "Wilhelm Brandenburg Akti-Fit Hähnchenbrust 100g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "1.19",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        },
        {
            "id": "987710",
            "name": "Wiltmann Hähnchenbrustfilet mit Chili süß-sauer 50g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "0.89",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        },
        {
            "id": "72675",
            "name": "Wilhelm Brandenburg Magere Fleischsülze 250g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "2.95",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        },
        {
            "id": "969301",
            "name": "Wilhelm Brandenburg Schinkenröllchen mit Sahnemeerrettich in Aspik 100g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "1.39",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        },
        {
            "id": "1379271",
            "name": "Wilhelm Brandenburg Frühstücksschmaus nach Art einer Fleischsülzwurst 100g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "1.19",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        },
        {
            "id": "698845",
            "name": "Wilhelm Brandenburg Deutsches Corned Beef 100g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "1.59",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        },
        {
            "id": "376979",
            "name": "REWE Beste Wahl Deutsches Corned Beef 100g",
            "category": [
                "Corned Beef \u0026 Sülze"
            ],
            "units": "1",
            "price": "1.25",
            "savingsPercent": "0.00",
            "savingsAmount": "0.00"
        }
    ],
    "basket": {
        "totalProducts": 850,
        "totalUnits": 851,
        "totalNetValue": 2055.3891,
        "taxes": "",
        "pfand": 3.1,
        "totalBasketValue": 2058.4891
    },
    "checkout": {
        "country": "",
        "city": "",
        "postcode": "",
        "paymentMethod": "",
        "creditcardType": "",
        "shipment": "DELIVERY",
        "shipmentPrice": "",
        "newsletter": "false",
        "vocherCode": "",
        "voucherValue": "",
        "orderType": "standard"
    }
});

var composer = new ReweComposer();
var jsonReceipt = composer.getJsonReceipt(testreceipt);
console.log("REWE Translate: " + jsonReceipt);
console.log("end");