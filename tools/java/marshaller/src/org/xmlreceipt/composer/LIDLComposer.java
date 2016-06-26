package org.xmlreceipt.composer;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;
import java.math.BigInteger;
import java.util.StringTokenizer;


/**
 * Created by stevens on 26/06/16.
 */
public class LIDLComposer extends AbstractComposer {

    public final static String SELLERNAME = "Lidl Deutschland Einkaufsagentur GmbH & Co. KG";
    public final static BigInteger DUNS = new BigInteger("551032670");
    public final static String VATIN = "DE814 838 662";
    public final static String CURRENCY = "EUR";

    public final static String ADDRESS = "Lidl Deutschland Einkaufsagentur GmbH & Co. KG\n" +
            "Stiftsbergstraße 1\n" +
            "74172 Neckarsulm";
    public static final String URI = "http://www.lidl.de";


    public LIDLComposer() {
        super(CURRENCY);
    }

    /**
     * @return
     */
    public Xmlreceipt.Seller createSeller() {
        Xmlreceipt.Seller seller = factory.createXmlreceiptSeller();

        seller.setSellername(SELLERNAME);
        seller.setSelleraddress(ADDRESS);
        seller.setVatin(VATIN);
        seller.setUri(URI);

        Xmlreceipt.Seller.Sellerid sellerid = factory.createXmlreceiptSellerSellerid();
        sellerid.setDuns(DUNS);
        seller.setSellerid(sellerid);

        return seller;
    }


    /**
     * Create a  item node about the product selled by LIDL given by ean
     *
     * @param ean
     * @return null if corresponding product info could not retrieved, otherwise the xml node that holds the needed information
     */
    public Xmlreceipt.Itemlist.Item createItem(String ean) throws IOException {
        Xmlreceipt.Itemlist.Item item = factory.createXmlreceiptItemlistItem();

        Xmlreceipt.Itemlist.Item.Itemid itemid = factory.createXmlreceiptItemlistItemItemid();
        itemid.setEan(new BigInteger(ean));
        item.setItemid(itemid);

        // Unfortunately, we could not scan the content page directly, but we have to retrieve the url of the content page
        String searchUrl = "http://www.discounter-preisvergleich.de/suche.php?s=" + ean + "&d=LIDL";
        Document document = Jsoup.connect(searchUrl).get();
        Elements preview = document.select(".produktPreview");
        String contentUrl = preview.attr("href");

        // Now we have the contentUrl to retrieve the needed information
        document = Jsoup.connect(contentUrl).get();

        // Retrieve name of the product
        Elements iName = document.select("[itemprop=\"name\"]");
        String name = iName.get(0).text();
        item.setItemname(name);

        // Retrieve price of the product
        Xmlreceipt.Itemlist.Item.Price price = factory.createXmlreceiptItemlistItemPrice();

        Elements iPrice = document.select("[itemprop=\"price\"]");
        String value = iPrice.get(0).text();

        Elements iCurrency = document.select("[itemprop=\"priceCurrency\"]");
        String currency = iCurrency.get(0).attr("content");

        price.setCurrency(currency);
        price.setItemvalue(Float.parseFloat(value));

        item.setPrice(price);

        // Retrieve quantity of the product
        Xmlreceipt.Itemlist.Item.Quantity quantity = factory.createXmlreceiptItemlistItemQuantity();

        Elements iQuantity = document.select(".produktPreview");
        String content = iQuantity.get(0).attr("data-content");

        //quantity format "Menge:<WHITESPACE><quant><WHITESPACE><unit>" with unit e.g. l for litre g for gramm and St for a unit
        StringTokenizer st = new StringTokenizer(content);
        String prefix = st.nextToken();
        String quant = st.nextToken();
        String unit = st.nextToken();

        if ("l".equals(unit)) {
            float litre = Float.parseFloat(quant);
            quantity.setLitre(litre);
        }

        if ("g".equals(unit)) {
            float gramm = Float.parseFloat(quant);
            quantity.setGramm(gramm);
        }

        if ("St".equals(unit)) {
            float un = Float.parseFloat(quant);
            quantity.setUnits(un);
        }

        item.setQuantity(quantity);

        return item;
    }

}
