package org.xmlreceipt.marshaller;


import org.xmlreceipt.composer.AbstractComposer;
import org.xmlreceipt.composer.LIDLComposer;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.math.BigInteger;

import static org.junit.Assert.assertEquals;

/**
 * /**
 * Created by stevens on 26/06/16.
 */
public class LIDLComposerTest {

    final String MILK_EAN = "20078171";
    final String MILK_NAME = "H-Milch, 1,5 % Fett";
    final String MILK_CURRENCY = "EUR";
    final float MILK_PRICE = 0.42f;
    final float MILK_LITRE = 1.0f;


    @org.junit.Test
    public void createItemlist() throws Exception {
        String[] testSell = {
                "20067397",
                "20000653",
                "20003548",
                "20235130"
        };
        AbstractComposer lidlReceipt = new LIDLComposer();

        for (String ean : testSell) {
            Xmlreceipt.Itemlist.Item item = lidlReceipt.addItem(ean);
        }

        Xmlreceipt receipt = lidlReceipt.getXmlReceipt();

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(receipt, System.out);


    }

    @org.junit.Test
    public void createSeller() throws Exception {
        LIDLComposer lidlReceipt = new LIDLComposer();
        Xmlreceipt.Seller seller = lidlReceipt.createSeller();

        assertEquals("seller name", LIDLComposer.SELLERNAME, seller.getSellername());
        assertEquals("seller id", LIDLComposer.DUNS, seller.getSellerid().getDuns());
        assertEquals("seller vatin", LIDLComposer.VATIN, seller.getVatin());
        assertEquals("seller uri", LIDLComposer.URI, seller.getUri());
        assertEquals("seller address", LIDLComposer.ADDRESS, seller.getSelleraddress());

    }


    @org.junit.Test
    public void createItem() throws Exception {
        LIDLComposer lidlReceipt = new LIDLComposer();
        Xmlreceipt.Itemlist.Item item = lidlReceipt.createItem(MILK_EAN);

        assertEquals("item name", MILK_NAME, item.getItemname());
        assertEquals("ean item id", new BigInteger(MILK_EAN), item.getItemid().getEan());
        assertEquals("price currency", MILK_CURRENCY, item.getPrice().getCurrency());
        assertEquals("price value", MILK_PRICE, item.getPrice().getItemvalue(), 0.0f);
        assertEquals("quantity gramm", MILK_LITRE, item.getQuantity().getLitre(), 0.0f);
    }


}