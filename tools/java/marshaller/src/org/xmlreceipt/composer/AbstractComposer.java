package org.xmlreceipt.composer;

import org.xmlreceipt.marshaller.ObjectFactory;
import org.xmlreceipt.marshaller.Xmlreceipt;

import java.io.IOException;
import java.math.BigInteger;
import java.util.List;


/**
 * Created by stevens on 26/06/16.
 */
public abstract class AbstractComposer {


    protected static String currency = "EUR";

    final protected ObjectFactory factory = new ObjectFactory();

    final protected Xmlreceipt xmlReceipt = factory.createXmlreceipt();

    public AbstractComposer() {
        AbstractComposer.currency = currency;
        init();
    }

    public AbstractComposer(String currency) {
        AbstractComposer.currency = currency;
        init();
    }


    private void init() {
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


    public Xmlreceipt.Itemlist.Item addItem(Xmlreceipt.Itemlist.Item item) throws IOException {
        List<Xmlreceipt.Itemlist.Item> items = xmlReceipt.getItemlist().getItem();
        items.add(item);

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


    public Xmlreceipt getXmlReceipt() {
        return xmlReceipt;
    }

    /**
     * @return
     */
    abstract public Xmlreceipt.Seller createSeller();


}
