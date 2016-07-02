package org.xmlreceipt.lookup.impl;

import org.xmlreceipt.lookup.ItemLookup;
import org.xmlreceipt.marshaller.ObjectFactory;
import org.xmlreceipt.marshaller.UtilMethods;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;
import java.util.HashMap;

/**
 * Created by stevens on 01/07/16.
 */
public class InternalLookup implements ItemLookup {


    private HashMap<String, MappingItem> map;

    public InternalLookup() {
        map = new HashMap<String, MappingItem>();

        map.put("REWE Mehrkornbrötchen 8er",
                new MappingItem("REWE Beste Wahl Mehrkornbrötchen 560g",
                        "rewe:1079114",
                        "https://img.rewe-static.de/1079114/24586625_digital-image.png?resize=260px:260px"
                ));

        map.put("REWE Bio Frischkäse Natur",
                new MappingItem("REWE Bio Frischkäse Doppelrahmstufe 175g",
                        "rewe:200397",
                        "https://img.rewe-static.de/0200397/4997410_digital-image.png?resize=260px:260px"
                ));

        map.put("Mango essreif",
                new MappingItem("Mango essreif",
                        "rewe:25267",
                        "https://img.rewe-static.de/0025267/24569609_digital-image.png?resize=260px:260px"
                ));

        map.put("Wagner Steinofen Pizza Spinat",
                new MappingItem("Original Wagner Steinofen Pizza Spinat 360g",
                        "rewe:2120509",
                        "https://img.rewe-static.de/2120509/23173003_digital-image.png?resize=260px:260px"
                ));

        map.put("REWE Bio Eier Klasse M-L",
                new MappingItem("REWE Bio Frische Bio-Eier 6 Stück ",
                        "rewe:197892",
                        "https://img.rewe-static.de/0197892/4777810_digital-image.png?resize=260px:260px"
                ));

        map.put("Kühne Gewürzgurken Auslese",
                new MappingItem("Kühne Gewürzgurken Auslese",
                        "gtin:2000422676881",
                        "http://prdimg.affili.net/img/size/180/src/d2jdyzt6tc17s.cloudfront.net/products/images/4502040067_40804651_01.jpg.jpg"
                ));

        map.put("Wagner Steinofen Pizza Mozzarella",
                new MappingItem("Kühne Gewürzgurken Auslese",
                        "gtin:4009233003952",
                        "http://www.codecheck.info/img/36062/1"
                ));

        map.put("Colgate Zahncreme Sensation White",
                new MappingItem("Colgate - Sensation White",
                        "gtin:8718951033702",
                        "http://www.codecheck.info/img/36062/1"
                ));

        map.put("Wagner Steinofen Elsässer Flammkuchen",
                new MappingItem("Wagner “herzhafter Flammkuchen” (Unser Original)",
                        "gtin:4009233003686",
                        "http://www.codecheck.info/img/49183823/1"
                ));

        map.put("Wagner Steinofen Pizza Thunfisch",
                new MappingItem("Original Wagner Steinofen Thunfisch",
                        "gtin:4009233003921",
                        "http://www.codecheck.info/img/36069/1"
                ));

        map.put("REWE Bio Paprika Mix",
                new MappingItem("REWE Bio Paprika Mix 400g",
                        "rewe:1056856",
                        "https://img.rewe-static.de/1056856/9685530_digital-image.png?resize=260px:260px"
                ));
    }

    private MappingItem getItem(String key) {
        return map.get(key);
    }

    @Override
    public boolean lookupByName(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String name) throws IOException {
        MappingItem mItem = getItem(name);
        if (mItem != null) {
            if (mItem.id.startsWith("gtin:")) {
                UtilMethods.setGTIN(factory, item, mItem.id.substring(5));
            } else {
                UtilMethods.setSellerid(factory, item, mItem.id);
            }
            item.setItemname(mItem.name);
            UtilMethods.addIconUrl(factory, item, mItem.iconurl);
            return true;
        }
        return false;
    }

    class MappingItem {

        public String iconurl;
        public String name;
        public String id;

        MappingItem(String name, String id, String iconurl) {
            this.iconurl = iconurl;
            this.name = name;
            this.id = id;
        }

    }
}
