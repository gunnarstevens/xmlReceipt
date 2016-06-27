package org.xmlreceipt.composer;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
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
    static int found = 0;
    static int notFound = 0;
    static int moreThanOneFound = 0;


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

        return item;
    }

    /**
     * Convert the pdf receipt getting from a online buy into a corresponding xmlReceipt
     *
     * @param txtReceipt // at the moment the pdf is converted to text manually
     * @return
     */
    public Xmlreceipt convertPDFReceipt(InputStream txtReceipt) throws IOException {

/*      PDFTextStripper pdfStripper = null;
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
*/

        REWEReceiptScanner scanner = new REWEReceiptScanner(txtReceipt);

        while (scanner.hasNextItem()) {
            REWEReceiptScanner.Item item = scanner.nextItem();
            getXmlReceipt().getItemlist().getItem().add(createItem(item));
        }

        System.out.println("FOUND: " + found + " MORE THAN ONE FOUND: " + moreThanOneFound + " NOT FOUND: " + notFound);
        return getXmlReceipt();
    }


    public Xmlreceipt.Itemlist.Item createItem(REWEReceiptScanner.Item input) throws IOException {
        Xmlreceipt.Itemlist.Item item = factory.createXmlreceiptItemlistItem();
        //TODO: Set unit

        item.setItemname(input.name);

        Xmlreceipt.Itemlist.Item.Price price = factory.createXmlreceiptItemlistItemPrice();
        price.setCurrency("EUR");
        price.setItemvalue(input.priceSingle);
        price.setItemtax((Math.round(input.priceTaxSingle * 100) / 100.0f));
        item.setPrice(price);

        try {
            lookupREWE(input.name);
        } catch (Exception exp) {
            // ignore
            exp.printStackTrace();
        }
        return item;
    }

    public void lookupREWE(String search) throws IOException {
        String tmp = java.net.URLEncoder.encode(search, "UTF-8");
        String searchUrl = "https://shop.rewe.de/productList?search=" + tmp;

        Document document = Jsoup.connect(searchUrl).get();
        Elements preview = document.select(".rs-productlink");
        // System.out.println("REWE found: " + preview.size() + " : " + search);
        if (preview != null && preview.size() == 1) {
            found++;
        } else if (preview != null && preview.size() > 1) {
            moreThanOneFound++;
        } else {
            lookupREWE2(search);
        }
    }

    public void lookupREWE2(String search) throws IOException {
        String substring = "";
        for (int i = 0; i < search.length(); i++) {
            substring += (Character.isAlphabetic(search.charAt(i)) == true ? search.charAt(i) : " ");
        }

        String tmp = java.net.URLEncoder.encode(substring, "UTF-8");
        String searchUrl = "https://shop.rewe.de/productList?search=" + tmp;

        Document document = Jsoup.connect(searchUrl).get();
        Elements preview = document.select(".rs-productlink");
        // System.out.println("REWE found: " + preview.size() + " : " + search);
        if (preview != null && preview.size() == 1) {
            found++;
        } else if (preview != null && preview.size() > 1) {
            moreThanOneFound++;
        } else {
            lookupCodecheck(search);
        }
    }

    public void lookupCodecheck(String search) throws IOException {

        String tmp = java.net.URLEncoder.encode(search, "UTF-8");
        String searchUrl = "http://www.codecheck.info/product.search?q=" + tmp + "&OK=Suchen";

        Document document = Jsoup.connect(searchUrl).get();
        Elements preview = document.select(".product-info-item");
        // System.out.println("CODECHECK found: " + preview.size() + " : " + search);
        if (preview != null && preview.size() == 1) {
            found++;
        } else if (preview != null && preview.size() > 1) {
            moreThanOneFound++;
        } else {
            lookupMyTime(search);
        }
    }


    public void lookupMyTime(String search) throws IOException {
        String tmp = java.net.URLEncoder.encode(search, "UTF-8");
        String searchUrl = "http://www.mytime.de/search_result.php?search_query_keyword=" + tmp;

        Document document = Jsoup.connect(searchUrl).get();
        Elements preview = document.select(".productTitle");
        // System.out.println("MYTIME found: " + preview.size() + " : " + search);
        if (preview != null && preview.size() == 1) {
            found++;
        } else if (preview != null && preview.size() > 1) {
            moreThanOneFound++;
        } else {
            notFound++;
            System.out.println("not found: " + preview.size() + " : " + search);
        }

    }
}
