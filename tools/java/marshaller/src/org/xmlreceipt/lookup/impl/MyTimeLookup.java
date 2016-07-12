package org.xmlreceipt.lookup.impl;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.xmlreceipt.lookup.ItemLookup;
import org.xmlreceipt.marshaller.ObjectFactory;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;

/**
 * Created by stevens on 01/07/16.
 */
public class MyTimeLookup implements ItemLookup {


    @Override
    public boolean lookupByName(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String name) throws IOException {
        String tmp = java.net.URLEncoder.encode(name, "UTF-8");
        String searchUrl = "http://www.mytime.de/search_result.php?search_query_keyword=" + tmp;

        Document document = Jsoup.connect(searchUrl).get();
        Elements preview = document.select(".productTitle");
        System.out.println("MYTIME found: " + preview.size() + " : " + searchUrl);
        return preview.size() > 0;
    }
}
