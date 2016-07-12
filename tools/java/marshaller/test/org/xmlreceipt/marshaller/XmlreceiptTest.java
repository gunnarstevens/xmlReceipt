package org.xmlreceipt.marshaller;

import org.xmlreceipt.marshaller.xmlreceipt.ObjectFactory;

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


    ObjectFactory.Xmlreceipt getTestReceipt1() throws JAXBException {
        File testFile = new File("./test/res/testreceipt1.xml");

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(ObjectFactory.Xmlreceipt.class);
        Unmarshaller u = jc.createUnmarshaller();
        ObjectFactory.Xmlreceipt testReceipt = (ObjectFactory.Xmlreceipt) u.unmarshal(testFile);
        return testReceipt;
    }

    @org.junit.Test
    public void getSeller() throws Exception {
        ObjectFactory.Xmlreceipt xmlreceipt = getTestReceipt1();
        ObjectFactory.Xmlreceipt.Seller seller = xmlreceipt.getSeller();
        assertEquals("seller name", "REWE Markt GmbH", seller.getSellername());
        assertEquals("seller id", new BigInteger("312522838"), seller.getSellerid().getDuns());
        assertEquals("seller vatin", "DE 812 706 034", seller.getVatin());
        assertEquals("uri", "https://www.rewe.de/", seller.getUri());

        assertEquals("seller address", "\n" +
                "            REWE Markt GmbH\n" +
                "            Domstraße 20\n" +
                "            50668 Köln\n" +
                "        ", seller.getSelleraddress());
        assertEquals("aspect name", "newsletter", seller.getAspect().get(0).getAspectname());
        assertEquals("aspect value", "https://www.rewe.de/service/newsletter/", seller.getAspect().get(0).getAspectvalue());

    }

    @org.junit.Test
    public void setSeller() throws Exception {
        ObjectFactory factory = new ObjectFactory();
        ObjectFactory.Xmlreceipt xmlreceipt = factory.createXmlreceipt();
        ObjectFactory.Xmlreceipt.Seller seller = factory.createXmlreceiptSeller();
        ObjectFactory.Xmlreceipt.Seller.Sellerid sellerid = factory.createXmlreceiptSellerSellerid();
        seller.setSellername("Name");
        seller.setSelleraddress("Address");
        seller.setSellerid(sellerid);
        seller.getSellerid().setDuns(new BigInteger("3928324"));

        xmlreceipt.setSeller(seller);
        seller = xmlreceipt.getSeller();
        assertEquals("seller name", "Name", seller.getSellername());
        assertEquals("seller id", new BigInteger("3928324"), seller.getSellerid().getDuns());
        assertEquals("seller address", "Address", seller.getSelleraddress());

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(ObjectFactory.Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(xmlreceipt, System.out);
    }

    @org.junit.Test
    public void getItemlist() throws Exception {
        ObjectFactory.Xmlreceipt xmlreceipt = getTestReceipt1();
        ObjectFactory.Xmlreceipt.Itemlist ilist = xmlreceipt.getItemlist();
        ObjectFactory.Xmlreceipt.Itemlist.Item item = ilist.getItem().get(0);

        assertEquals("item name", "Original Wagner Big Pizza BBQ-Chicken", item.getItemname());
        assertEquals("ean item id", new BigInteger("4009233012084"), item.getItemid().getEan());
        assertEquals("ean13 item id", new BigInteger("4009233012084"), item.getItemid().getEan13());
        assertEquals("seller item id", "2670477", item.getItemid().getSelleritemid());

        assertEquals("dates bestbefore", 1506649785000l, item.getDates().getBestbefore().toGregorianCalendar().getTimeInMillis());

        assertEquals("price currency", "EUR", item.getPrice().getCurrency());
        assertEquals("price value", 2.99f, item.getPrice().getItemvalue(), 0.0f);

        assertEquals("quantity gramm", 425.0f, item.getQuantity().getGramm(), 0.0f);

        assertEquals("elass category", "Fertiggericht, Halbfertiggericht (Sonstige, nicht spezifiziert)", item.getItemgroup().get(0).getEclass().getClassificationname());
        assertEquals("elass category langue", "DE-de", item.getItemgroup().get(0).getEclass().getLanguage());

        assertEquals("seller category", "Pizza Hühnchen", item.getItemgroup().get(0).getSellercategory().getClassificationname());
        assertEquals("seller category langue", "DE-de", item.getItemgroup().get(0).getSellercategory().getLanguage());
    }

    @org.junit.Test
    public void setItemlist() throws Exception {

    }

}