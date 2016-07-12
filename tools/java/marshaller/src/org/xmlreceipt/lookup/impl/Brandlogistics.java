package org.xmlreceipt.lookup.impl;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.xmlreceipt.lookup.ItemLookup;
import org.xmlreceipt.marshaller.ObjectFactory;
import org.xmlreceipt.marshaller.UtilMethods;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;
import java.net.URLEncoder;

/**
 * Created by stevens on 01/07/16.
 */
public class Brandlogistics implements ItemLookup {

    /**
     * retrieve the gtin from the item described by the given codecheck page
     *
     * @param document the codecheck page
     * @return the gtin - null, if  gtin was not found
     */
    public static String getGTIN(Document document) {
        Elements eanLabel = document.select(".ean-label");
        String gtin2 = eanLabel.text();
        return gtin2.substring(5);
    }

    /**
     * retrieve the item image from the item described by the given codecheck page
     *
     * @param document the codecheck page
     * @return the url - null, if no image was not found
     */
    public static String getImageUrl(Document document) {

        Elements img = document.select(".product-img-box img");
        Element first = img.first();
        if (first != null) {
            String imgloc = first.attr("src");
            return imgloc;
        }
        return null;
    }


    /**
     * retrieve the item name from the item described by the given codecheck page
     *
     * @param document the codecheck page
     * @return the name - null, if no name was not found
     */
    public static String getItemname(Document document) {


        Elements title = document.select(".product-name  h1");
        if (title != null && title.size() > 0) {
            return title.text();
        }

        return null;
    }

    @Override
    public boolean lookupByName(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String name) throws IOException {
        String tmp = URLEncoder.encode(name, "UTF-8");
        String searchUrl = "http://www.brandlogistics.net/catalogsearch/result/?q=" + tmp;

        Document document = Jsoup.connect(searchUrl).get();

        if (document.toString().contains("Ihre Suchanfrage lieferte keine Ergebnisse") == false) {
            Elements refs = document.select(".image-container a");
            String itemUrl = refs.first().attr("href");
            document = Jsoup.connect(itemUrl).get();
            String gtin = getGTIN(document);
            String ccName = getItemname(document);

            if (ccName != null && ccName.length() > 0 && gtin != null && gtin.length() > 0) {
                item.setItemname(ccName);
                UtilMethods.setGTIN(factory, item, gtin);
                UtilMethods.addIconUrl(factory, item, getImageUrl(document));
                return true;
            } else {
                System.out.println("Codecheck lookup: NOT FOUND " + name);
            }
        }
        return false;
    }
}
