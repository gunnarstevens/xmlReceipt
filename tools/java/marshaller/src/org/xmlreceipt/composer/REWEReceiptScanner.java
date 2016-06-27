package org.xmlreceipt.composer;

import java.io.InputStream;
import java.util.Scanner;

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
public class REWEReceiptScanner {
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
