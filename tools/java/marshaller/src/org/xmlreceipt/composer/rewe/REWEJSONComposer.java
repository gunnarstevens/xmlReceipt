package org.xmlreceipt.composer.rewe;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.xmlreceipt.composer.AbstractComposer;
import org.xmlreceipt.lookup.impl.REWELookup;
import org.xmlreceipt.marshaller.UtilMethods;
import org.xmlreceipt.marshaller.xmlreceipt.ObjectFactory;

import javax.xml.datatype.DatatypeConfigurationException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigInteger;
import java.util.Iterator;
import java.util.List;

/**
 * Created by stevens on 02/07/16.
 */
public class REWEJSONComposer extends AbstractComposer {

    public static final String URI = "www.rewe.de";

    public REWEJSONComposer() {
        super();
    }

    public ObjectFactory.Xmlreceipt getXmlReceipt(InputStream is) throws Exception {

        InputStreamReader isr = new InputStreamReader(is);

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonReceipt = (JSONObject) jsonParser.parse(isr);

        createSeller((JSONObject) jsonReceipt.get("reweMarket"));
        createItemList((JSONArray) jsonReceipt.get("products"));

        // create total at the end by reading the information from the basket
        createTotal((JSONObject) jsonReceipt.get("basket"));

        return getXmlReceipt();
    }

    @Override
    public ObjectFactory.Xmlreceipt.Seller createSeller() {
        ObjectFactory.Xmlreceipt.Seller seller = factory.createXmlreceiptSeller();
        return seller;
    }

    private void createSeller(JSONObject market) {
        ObjectFactory.Xmlreceipt.Seller seller = xmlReceipt.getSeller();

        seller.setSellername("REWE " + market.get("city"));
        seller.setSelleraddress("REWE " + market.get("city") + "\n"
                + market.get("street") + "\n" + market.get("postcode") + " " + market.get("city"));
        seller.setUri(URI);

        ObjectFactory.Xmlreceipt.Seller.Sellerid sellerid = factory.createXmlreceiptSellerSellerid();
        sellerid.setSellerid("rewe:" + market.get("id"));
        seller.setSellerid(sellerid);

    }


    public void createTotal(JSONObject basket) {
        Long tp = (Long) basket.get("totalProducts");
        Double tnv = (Double) basket.get("totalNetValue");
        Long tu = (Long) basket.get("totalUnits");


        ObjectFactory.Xmlreceipt.Total total = xmlReceipt.getTotal();

        ObjectFactory.Xmlreceipt.Total.Totalprice totalprice = total.getTotalprice();
        totalprice.setCurrency(currency);
        totalprice.setTotalnetvalue(Float.parseFloat(tnv.toString()));
        total.setTotalprice(totalprice);

        ObjectFactory.Xmlreceipt.Total.Totalquantity totalquantity = total.getTotalquantity();
        totalquantity.setTotalProducts(new BigInteger(tp.toString()));
        totalquantity.setTotalUnits(new BigInteger(tu.toString()));
        total.setTotalquantity(totalquantity);

        try {
            total.setPurchasedate(UtilMethods.getXMLGregorianCalendarNow());
        } catch (DatatypeConfigurationException e) {
        }
    }


    public void createItemList(JSONArray products) {
        Iterator it = products.iterator();
        while (it.hasNext()) {
            JSONObject product = (JSONObject) it.next();
            try {
                addItem(createItem(product));
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private ObjectFactory.Xmlreceipt.Itemlist.Item createItem(JSONObject product) {
        ObjectFactory.Xmlreceipt.Itemlist.Item item = factory.createXmlreceiptItemlistItem();

        BigInteger units = new BigInteger(product.get("units").toString());
        Object sellerid = product.get("id");
        Object price = product.get("price");

        JSONArray cat = (JSONArray) product.get("category");

        item.setItemname((String) product.get("name"));

        if (units.intValue() != 1) {
            item.setUnits(units);
        }

        ObjectFactory.Xmlreceipt.Itemlist.Item.Itemid xmlID = factory.createXmlreceiptItemlistItemItemid();
        xmlID.setSelleritemid("rewe:" + sellerid);
        item.setItemid(xmlID);

        ObjectFactory.Xmlreceipt.Itemlist.Item.Price xmlPrice = factory.createXmlreceiptItemlistItemPrice();
        xmlPrice.setCurrency(currency);
        xmlPrice.setItemvalue(Float.parseFloat(price.toString()));
        item.setPrice(xmlPrice);

        try {
            UtilMethods.addIconUrl(factory, item, REWELookup.lookupImageByProductId(sellerid.toString()));
        } catch (IOException e) {
        }

        createCategory(item, cat);

        return item;
    }

    private void createCategory(ObjectFactory.Xmlreceipt.Itemlist.Item item, JSONArray cat) {
        List<ObjectFactory.Xmlreceipt.Itemlist.Item.Itemgroup> igroups = item.getItemgroup();
        Iterator it = cat.iterator();

        while (it.hasNext()) {
            Object catitem = it.next();

            ObjectFactory.Xmlreceipt.Itemlist.Item.Itemgroup igroup = factory.createXmlreceiptItemlistItemItemgroup();
            ObjectFactory.Xmlreceipt.Itemlist.Item.Itemgroup.Sellercategory selCat = factory.createXmlreceiptItemlistItemItemgroupSellercategory();
            selCat.setClassificationname(catitem.toString());
            selCat.setLanguage("DE-de");

            igroup.setSellercategory(selCat);
            igroups.add(igroup);
        }

    }


}
