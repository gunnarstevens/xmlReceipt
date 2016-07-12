package org.xmlreceipt.marshaller;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.util.GregorianCalendar;

/**
 * Util methods for creating and reading Xml Receipts
 * Created by stevens on 01/07/16.
 */
public class UtilMethods {

    public static void addIconUrl(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String icon) {
        Xmlreceipt.Itemlist.Item.Aspect iconUri = factory.createXmlreceiptItemlistItemAspect();
        iconUri.setAspectname("iconurl");
        iconUri.setAspectvalue(icon);
        item.getAspect().add(iconUri);
    }

    public static void setGTIN(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String gtin) {
        Xmlreceipt.Itemlist.Item.Itemid itemId = factory.createXmlreceiptItemlistItemItemid();
        itemId.setGtin(gtin);
        item.setItemid(itemId);
    }

    public static void setSellerid(ObjectFactory factory, Xmlreceipt.Itemlist.Item item, String id) {
        Xmlreceipt.Itemlist.Item.Itemid itemId = factory.createXmlreceiptItemlistItemItemid();
        itemId.setSelleritemid(id);
        item.setItemid(itemId);
    }


    public static XMLGregorianCalendar getXMLGregorianCalendarNow()
            throws DatatypeConfigurationException {
        GregorianCalendar gregorianCalendar = new GregorianCalendar();
        DatatypeFactory datatypeFactory = DatatypeFactory.newInstance();
        XMLGregorianCalendar now =
                datatypeFactory.newXMLGregorianCalendar(gregorianCalendar);
        return now;
    }
}
