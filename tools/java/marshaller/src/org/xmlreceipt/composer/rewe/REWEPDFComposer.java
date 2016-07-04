package org.xmlreceipt.composer.rewe;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.xmlreceipt.composer.AbstractComposer;
import org.xmlreceipt.lookup.ItemLookup;
import org.xmlreceipt.lookup.impl.Brandlogistics;
import org.xmlreceipt.lookup.impl.Codecheck;
import org.xmlreceipt.lookup.impl.InternalLookup;
import org.xmlreceipt.lookup.impl.REWELookup;
import org.xmlreceipt.marshaller.xmlrecipt.Xmlreceipt;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigInteger;
import java.util.Scanner;
import java.util.Vector;


/**
 * Created by stevens on 26/06/16.
 */
public class REWEPDFComposer extends AbstractComposer {


    public final static String SELLERNAME = "REWE Markt GmbH";
    public final static BigInteger DUNS = new BigInteger("326495017");
    public final static String VATIN = "DE 812706034";
    public final static String CURRENCY = "EUR";
    public final static String ADDRESS = "REWE Markt GmbH, Domstr. 20, 50668 Koeln";
    public static final String URI = "www.rewe.de";
    Vector<ItemLookup> lookups;

    public REWEPDFComposer() {

        super(CURRENCY);

        lookups = new Vector<ItemLookup>();
        lookups.add(new InternalLookup());
        lookups.add(new REWELookup(false));
        lookups.add(new REWELookup(true));
        lookups.add(new Codecheck());
        lookups.add(new Brandlogistics());
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
     * @param isPDFReceipt // at the moment the pdf is converted to text manually
     * @return
     */
    public Xmlreceipt getXmlReceipt(InputStream isPDFReceipt) throws IOException {

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

        REWEReceiptScanner scanner = new REWEReceiptScanner(isPDFReceipt);

        while (scanner.hasNextItem()) {
            REWEReceiptScanner.Item item = scanner.nextItem();
            super.addItem(createItem(item));
        }

        return getXmlReceipt();
    }

    public Xmlreceipt.Itemlist.Item createItem(REWEReceiptScanner.Item input) throws IOException {
        Xmlreceipt.Itemlist.Item item = factory.createXmlreceiptItemlistItem();

        item.setItemname(input.name);

        Xmlreceipt.Itemlist.Item.Price price = factory.createXmlreceiptItemlistItemPrice();
        price.setCurrency(currency);
        price.setItemvalue(input.priceSingle);
        price.setItemtax((Math.round(input.priceTaxSingle * 100) / 100.0f));
        item.setPrice(price);

        try {
            boolean found = false;
            for (ItemLookup lookup : lookups) {
                if (lookup.lookupByName(factory, item, input.name) == true) {
                    found = true;
                    break;
                }
            }
            if (found == false) {
                System.out.println("NOT FOUND: " + input.name);
            }
        } catch (Exception exp) { // ignore
            exp.printStackTrace();
        }
        return item;
    }

    /**
     * Created by stevens on 27/06/16.
     * <p>
     * The REWEReceiptScanner reads an REWE receipt to scan the buyed items
     * <p>
     * the basic structure of a REWE  receipt looks like this
     * <p>
     * reweReceipt ::=  ((noise)* begin (item)*)* noise
     * noise ::= Any textline unequal "MwSt."
     * begin ::= "MwSt."; emptyline
     * item ::= itemName unit priceSingle priceTotal tax
     * itemName ::= Any textline with textlength >= 2; emptyline
     * unit ::= bigdezimal; emptyline
     * priceSingle ::= germanfloat; emptyline
     * priceTotal ::= germanfloat; emptyline
     * tax ::= "A" || "B" with "A" means 19% and "B" maeans "7%" tax
     * <p>
     * <p>
     * emptyline ::= ""
     * bigdezimal is a token java.util.Scanner.nextBigDecimal()
     * germanfloat is a float but with a "," delimiter instead of a "."
     */
    private class REWEReceiptScanner {
        static final String BEGIN = "MwSt.";
        static final float ATAX = 0.19f;
        static final float BTAX = 0.07f;
        private Scanner scanner;
        private Item current;

        public REWEReceiptScanner(InputStream receipt) {
            scanner = new Scanner(receipt);

            // set scanner to the first item
            if (scanBegin() == true) {
                // scan first item
                current = scanItem();
            }
        }

        public boolean hasNextItem() {
            return current != null;
        }

        public Item nextItem() {
            Item result = current;
            current = scanItem(); // set current to the next item or null, if we reach the end

            //HACK if name == "PFAND" than it is a special item we have to skip
            if (current != null && current.name.startsWith("PFAND")) {
                current = scanItem();
            }
            return result;
        }

        private Item scanItem() {
            Item item = new Item();

            item.name = scanName(); // REWE Beste Wahl Taschentücher-Box 100

            if (item.name.length() <= 2 || item.name.startsWith("Servicegebühr Lieferung")) {
                // HACK: if it not a valid item name we reached the end of a receipt page,
                // which means we have to skip noise, scan a begin line and read the item name again
                if (scanBegin() == false) {
                    return null;
                } else {
                    item.name = scanName();
                }
            }

            item.units = scanUnits(); // 2
            item.priceSingle = scanPrice(); // 0,99 €
            item.priceTotal = scanPrice(); // 1,98 €
            String tax = scanTax(); // A
            if (tax.contains("A")) {
                item.priceTaxSingle = item.priceSingle * ATAX;
                item.priceTaxTotal = item.priceTotal * ATAX;
            } else {
                item.priceTaxSingle = current.priceSingle * BTAX;
                item.priceTaxTotal = current.priceTotal * BTAX;
            }

            return item;
        }

        private String scanTax() {
            String tax = scanner.nextLine();
            scanner.nextLine();
            return tax;
        }

        /**
         * scan a item single price element
         *
         * @return single price
         */
        private float scanPrice() {
            StringBuffer price = new StringBuffer(scanner.nextLine());
            price.setCharAt(price.indexOf(","), '.');
            price.delete(price.length() - 2, price.length()); // remove EUR sign at the end
            scanner.nextLine();
            float res = Float.parseFloat(price.toString());
            return res;
        }

        /**
         * scan a item units element
         *
         * @return units
         */
        private int scanUnits() {
            String units = scanner.nextLine();
            scanner.nextLine();
            return Integer.parseInt(units);
        }

        /**
         * scan a item name element
         *
         * @return name
         */
        private String scanName() {
            String name = scanner.nextLine();
            scanner.nextLine();
            return name;
        }

        /**
         * scan a receipt item begin element
         *
         * @return true is a begin line is found, false otherwise (indicating the end of the stream is reached
         */
        private boolean scanBegin() {
            while (scanner.hasNext()) {
                String line = scanner.nextLine();
                if (BEGIN.equals(line)) {
                    scanner.nextLine();
                    return true;
                }
            }
            return false;
        }

        class Item {
            static final String currency = "EUR";
            String name;
            int units;
            float priceTotal;
            float priceSingle;
            float priceTaxTotal;
            float priceTaxSingle;
        }
    }

}
