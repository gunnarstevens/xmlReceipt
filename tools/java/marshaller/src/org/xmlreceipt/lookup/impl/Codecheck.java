package org.xmlreceipt.lookup.impl;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.xmlreceipt.lookup.ItemLookup;
import org.xmlreceipt.marshaller.xmlfoodlabeling.XmlFoodLabelling;
import org.xmlreceipt.marshaller.xmlrecipt.ObjectFactory;
import org.xmlreceipt.marshaller.xmlrecipt.UtilMethods;
import org.xmlreceipt.marshaller.xmlrecipt.Xmlreceipt;

import java.io.IOException;

/**
 * Created by stevens on 01/07/16.
 */
public class Codecheck implements ItemLookup {
    final String GTINLABEL = "Strichcode-Nummer";

    /**
     * retrieve the gtin from the item described by the given codecheck page
     *
     * @param document the codecheck page
     * @return the gtin - null, if  gtin was not found
     */
    public static String getGTIN(Document document) {
        Elements infoItem = document.select(".product-info-item-list .product-info-item");
        for (Element ii : infoItem) {
            Elements p = ii.select("p");
            Element first = p.first();
            String text = first.text();
            if ("Strichcode-Nummer".equals(text)) {
                return p.last().text();
            }
        }
        return null;
    }

    /**
     * retrieve the item image from the item described by the given codecheck page
     *
     * @param document the codecheck page
     * @return the url - null, if no image was not found
     */
    public static String getImageUrl(Document document) {

        Elements img = document.select(".product-image img");
        Element first = img.first();
        if (first != null) {
            String imgloc = document.baseUri() + first.attr("src");
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


        Elements title = document.select(".product-title h1");
        if (title != null && title.size() > 0) {
            return title.text();
        }

        return null;
    }

    @Override
    public boolean lookupByName(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String name) throws IOException {
        String tmp = java.net.URLEncoder.encode(name, "UTF-8");
        String searchUrl = "http://www.codecheck.info/product.search?q=" + tmp + "&OK=Suchen";

        Document document = Jsoup.connect(searchUrl).get();
        if (document.toString().contains("Es wurde kein Produkt mit den Begriffen") == false) {
            String ccName = Codecheck.getItemname(document);
            String gtin = Codecheck.getGTIN(document);
            if (ccName != null && ccName.length() > 0 && gtin != null && gtin.length() > 0) {
                item.setItemname(ccName);
                UtilMethods.setGTIN(factory, item, gtin);
                UtilMethods.addIconUrl(factory, item, Codecheck.getImageUrl(document));
                return true;
            } else {
                System.out.println("Codecheck lookup: NOT FOUND " + name);
                return false;
            }
        }
        return false;
    }


    public XmlFoodLabelling lookupFoodlabeling(org.xmlreceipt.marshaller.xmlfoodlabeling.ObjectFactory factory, String gtin) throws Exception {
        XmlFoodLabelling xmlFoodLabelling = factory.createXmlFoodLabelling();
        XmlFoodLabelling.Nutrition nutrition = factory.createXmlFoodLabellingNutrition();
        XmlFoodLabelling.Energyvalue energyvalue = factory.createXmlFoodLabellingEnergyvalue();
        xmlFoodLabelling.setEnergyvalue(energyvalue);
        xmlFoodLabelling.setNutrition(nutrition);

        String tmp = java.net.URLEncoder.encode(gtin, "UTF-8");
        String searchUrl = "http://www.codecheck.info/product.search?q=" + tmp + "&OK=Suchen";
        Document document = Jsoup.connect(searchUrl).get();

        Elements nutRows = document.select(".nutrition-facts tr");
        energyvalue.setKilocalories(9.0d);

        for (int i = 0; i < nutRows.size(); i++) {
            Element nuRow = nutRows.get(i);
            Elements cells = nuRow.select("td");
            String key = cells.get(0).text();

            if ("Energie / Brennwert".equals(key)) {
                String value = cells.get(1).text();
                value = null;
            }
        }
        return null;

    }
}
