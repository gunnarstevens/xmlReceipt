package org.xmlreceipt.composer;

import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessBuffer;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;


/**
 * Created by stevens on 26/06/16.
 */
public class REWEComposer extends AbstractComposer {

    public final static String SELLERNAME = "REWE Markt GmbH";
    public final static BigInteger DUNS = new BigInteger("326495017");
    public final static String VATIN = "DE 812706034";
    public final static String CURRENCY = "EUR";

    public final static String ADDRESS = "REWE Markt GmbH, Domstr. 20, 50668 Koeln";
    public static final String URI = "www.rewe.de";


    public REWEComposer() {
        super(CURRENCY);
    }

    @Override
    public Xmlreceipt.Itemlist.Item createItem(String idtype, String id) throws IOException {
        return null;
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
     * Create a  item node about the product selled by REWE given by product name
     *
     * @param itemName
     * @return null if corresponding product info could not retrieved, otherwise the xml node that holds the needed information
     */
    public Xmlreceipt.Itemlist.Item createItemByName(String itemName) throws IOException {
        Xmlreceipt.Itemlist.Item item = factory.createXmlreceiptItemlistItem();


        // Unfortunately, we could not scan the content page directly, but we have to retrieve the url of the content page
        String searchUrl = "https://shop.rewe.de/productList?search=" + itemName;
        Document document = Jsoup.connect(searchUrl).get();

        /*
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


        Xmlreceipt.Itemlist.Item.Itemid itemid = factory.createXmlreceiptItemlistItemItemid();
        itemid.setSelleritemid("0815");
        item.setItemid(itemid);

        */
        return item;
    }

    /**
     * Convert the pdf receipt getting from a online buy into a corresponding xmlReceipt
     *
     * @param pdfReceipt
     * @return
     */
    public Xmlreceipt convertPDFReceipt(InputStream pdfReceipt) throws IOException {

        PDFTextStripper pdfStripper = null;
        PDDocument pdDoc = null;
        COSDocument cosDoc = null;

        PDFParser parser = new PDFParser(new RandomAccessBuffer(pdfReceipt));
        parser.parse();
        cosDoc = parser.getDocument();

        pdfStripper = new PDFTextStripper();
        pdDoc = new PDDocument(cosDoc);
        pdfStripper.setStartPage(1);
        pdfStripper.setEndPage(5);

        String parsedText = pdfStripper.getText(pdDoc);
        System.out.println(parsedText);

        return null; // TODO
    }
}
