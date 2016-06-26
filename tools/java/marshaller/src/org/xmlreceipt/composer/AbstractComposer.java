package org.xmlreceipt.composer;

import org.xmlreceipt.marshaller.ObjectFactory;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;
import java.math.BigInteger;


/**
 * Created by stevens on 26/06/16.
 */
public abstract class AbstractComposer {


    private static String currency = "EUR";

    final ObjectFactory factory = new ObjectFactory();

    final Xmlreceipt xmlReceipt = factory.createXmlreceipt();

    public AbstractComposer(String currency) {
        AbstractComposer.currency = currency;
        xmlReceipt.setSeller(createSeller());
        xmlReceipt.setTotal(createTotal());
        xmlReceipt.setItemlist(factory.createXmlreceiptItemlist());
    }


    protected Xmlreceipt.Total createTotal() {
        Xmlreceipt.Total total = factory.createXmlreceiptTotal();

        Xmlreceipt.Total.Totalprice totalprice = factory.createXmlreceiptTotalTotalprice();
        totalprice.setCurrency(currency);
        totalprice.setTotalnetvalue(0.0f);
        total.setTotalprice(totalprice);

        Xmlreceipt.Total.Totalquantity totalquantity = factory.createXmlreceiptTotalTotalquantity();
        totalquantity.setTotalProducts(new BigInteger("0"));
        totalquantity.setTotalUnits(new BigInteger("0"));
        total.setTotalquantity(totalquantity);

        return total;
    }


    public Xmlreceipt.Itemlist.Item addItem(String idtype, String id) throws IOException {
        Xmlreceipt.Itemlist.Item item = createItem(idtype, id);
        xmlReceipt.getItemlist().getItem().add(item);

        // adjust total price
        Xmlreceipt.Total.Totalprice totalprice = xmlReceipt.getTotal().getTotalprice();
        float netvalue = totalprice.getTotalnetvalue() + item.getPrice().getItemvalue();
        totalprice.setTotalnetvalue(netvalue);

        // adjust total quantity
        Xmlreceipt.Total.Totalquantity totalquantity = xmlReceipt.getTotal().getTotalquantity();

        BigInteger tp = new BigInteger("" + (totalquantity.getTotalProducts().intValue() + 1));
        totalquantity.setTotalProducts(tp);

        BigInteger tu = new BigInteger("" + (totalquantity.getTotalUnits().intValue() + 1));
        totalquantity.setTotalUnits(tu);

        return item;
    }


    /**
     * Create a  item node about the product given by id
     * @param idtype the type of the id, eg. ean or gtin
     * @param id
     * @return null if corresponding product info could not retrieved, otherwise the xml node that holds the needed information
     * @throws IOException
     */
    abstract public Xmlreceipt.Itemlist.Item createItem(String idtype, String id) throws IOException;

    /**
     * @return
     */
    abstract public Xmlreceipt.Seller createSeller();


    public Xmlreceipt getXmlReceipt() {
        return xmlReceipt;
    }
}
