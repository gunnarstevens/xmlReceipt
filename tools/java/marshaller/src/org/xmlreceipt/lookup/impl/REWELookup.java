package org.xmlreceipt.lookup.impl;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.xmlreceipt.lookup.ItemLookup;
import org.xmlreceipt.marshaller.xmlrecipt.ObjectFactory;
import org.xmlreceipt.marshaller.xmlrecipt.UtilMethods;
import org.xmlreceipt.marshaller.xmlrecipt.Xmlreceipt;

import java.io.IOException;
import java.net.URLEncoder;
import java.util.Scanner;

/**
 * Looking in the REWE Onlineshop to retrieve the item
 * Created by stevens on 01/07/16.
 */
class REWELookupHelper {
    static void lookupREWEItemDetails(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, Element productItem) throws IOException {

        Elements preview = productItem.select(".rs-title > .rs-productlink");

        String details = preview.attr("href");
        Document detailsDoc = Jsoup.connect(details).get();

        // retrieve and set name
        String name = preview.text();
        item.setItemname(name);


        // retrieve and set icon
        String icon = productItem.select(".rs-productimage").attr("src");
        UtilMethods.addIconUrl(factory, item, icon);

        // units
        String units = detailsDoc.select(".rs-price--base").text();
        //TODO: analyze if it is litre, gramm or units

        // seller id
        UtilMethods.setSellerid(factory, item, "rewe:" + new Scanner(detailsDoc.select(".rs-article-number").text()).findInLine("[0-9]+"));
    }


    static boolean compareProductPrice(Element itemElem, Xmlreceipt.Itemlist.Item item) {

        float itemPrice = item.getPrice().getItemvalue();
        Element predecimal = itemElem.select(".rs-title .rs-price .rs-price__predecimal").first();
        Element decimal = itemElem.select(".rs-title .rs-price .rs-price__decimal").first();
        String strPrice = predecimal.text() + "." + decimal.text();

        return Math.abs(itemPrice - Float.parseFloat(strPrice)) < 0.1f;

    }
}

public class REWELookup implements ItemLookup {

    boolean broadSearch;

    public REWELookup(boolean broadSearch) {
        this.broadSearch = broadSearch;
    }

    static public String lookupImageByProductId(String id) throws IOException {
        String searchUrl = "https://shop.rewe.de/productList?search=" + URLEncoder.encode(id, "UTF-8");

        Document document = Jsoup.connect(searchUrl).get();
        Elements tmp = document.select(".rs-productimage");
        String icon = tmp.first().attr("src");
        return icon;
    }

    private String broadSearch(String search) {
        String result = "";
        for (int i = 0; i < search.length(); i++) {
            result += (Character.isAlphabetic(search.charAt(i)) == true ? search.charAt(i) : " ");
        }
        return result;
    }

    @Override
    public boolean lookupByName(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String name) throws IOException {
        name = (broadSearch ? broadSearch(name) : name);

        String searchUrl = "https://shop.rewe.de/productList?search=" + URLEncoder.encode(name, "UTF-8");

        Document document = Jsoup.connect(searchUrl).get();
        Elements products = document.select(".rs-js-product-item");

        if (products != null && products.size() > 0) {
            for (int i = 0; i < products.size(); i++) {
                if (REWELookupHelper.compareProductPrice(products.get(i), item) == true) {
                    REWELookupHelper.lookupREWEItemDetails(factory, item, products.get(i));
                    return true;
                }
            }
        }
        return false;
    }
}
