package org.xmlreceipt.marshaller;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import java.io.File;
import java.math.BigInteger;

import static org.junit.Assert.assertEquals;

/**
 * Created by stevens on 19/06/16.
 */
public class XmlreceiptTest {


    Xmlreceipt getTestReceipt1() throws JAXBException {
        File testFile = new File("./test/res/testreceipt1.xml");

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(Xmlreceipt.class);
        Unmarshaller u = jc.createUnmarshaller();
        Xmlreceipt testReceipt = (Xmlreceipt) u.unmarshal(testFile);
        return testReceipt;
    }

    @org.junit.Test
    public void getSeller() throws Exception {
        Xmlreceipt xmlreceipt = getTestReceipt1();
        Xmlreceipt.Seller seller = xmlreceipt.getSeller();
        assertEquals("seller name", "Mytime", seller.getSellername());
        assertEquals("seller id", "SELLER.MYTIME", seller.getSellerid());
        assertEquals("seller address", "http://mytime.de", seller.getSellerid());
    }

    @org.junit.Test
    public void setSeller() throws Exception {
        ObjectFactory factory = new ObjectFactory();
        Xmlreceipt xmlreceipt = factory.createXmlreceipt();
        Xmlreceipt.Seller seller = factory.createXmlreceiptSeller();
        seller.setSellername("Name");
        seller.setSelleraddress("Address");
        seller.getSellerid().setDuns(new BigInteger("3928324"));

        xmlreceipt.setSeller(seller);
        seller = xmlreceipt.getSeller();
        assertEquals("seller name", "Name", seller.getSellername());
        assertEquals("seller id", new BigInteger("3928324"), seller.getSellerid().getDuns());
        assertEquals("seller address", "Address", seller.getSelleraddress());

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(xmlreceipt, System.out);
    }

    @org.junit.Test
    public void getItemlist() throws Exception {
        Xmlreceipt xmlreceipt = getTestReceipt1();
        Xmlreceipt.Itemlist ilist = xmlreceipt.getItemlist();
        Xmlreceipt.Itemlist.Item item = ilist.getItem();

        assertEquals("quantity gramm", 420.0f, item.getQuantity().getGramm(), 0.0f);
        assertEquals("price brutto", 2.99f, item.getPrice().getItemvalue(), 0.0f);
        assertEquals("product name", "Original Wagner Big Pizza BBQ-Chicken", item.getItemname());
        assertEquals("product id", new BigInteger("4009233012084"), item.getItemid().getEan());
        assertEquals("price currency", "EUR", item.getPrice().getCurrency());
        assertEquals("category", "Lebensmittel", item.getItemgroup().getEclass().getClassifactionname());
        assertEquals("dates bestbefore", 1506649785000l, item.getDates().getBestbefore().toGregorianCalendar().getTimeInMillis());


    }

    @org.junit.Test
    public void setItemlist() throws Exception {

    }

}