package org.xmlreceipt.marshaller;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.xmlreceipt.composer.rewe.REWEJSONComposer;
import org.xmlreceipt.composer.rewe.REWEPDFComposer;
import org.xmlreceipt.marshaller.xmlreceipt.ObjectFactory;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

import static org.junit.Assert.assertEquals;

/**
 * /**
 * Created by stevens on 26/06/16.
 */
public class REWEComposerTest {


    @org.junit.Test
    public void testJSONReceipt() throws Exception {
        File testFile = new File("./test/res/reweBasket2.json");

        REWEJSONComposer rewejsonComposer = new REWEJSONComposer();
        ObjectFactory.Xmlreceipt receipt = rewejsonComposer.getXmlReceipt(new FileInputStream(testFile));

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(ObjectFactory.Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(receipt, System.out);

    }

    public void testJSONReceiptTotal() throws Exception {
        File testFile = new File("./test/res/reweBasket.json");

        InputStreamReader isr = new InputStreamReader(new FileInputStream(testFile));
        JSONParser jsonParser = new JSONParser();
        JSONObject jsonReceipt = (JSONObject) jsonParser.parse(isr);


        REWEJSONComposer rjc1 = new REWEJSONComposer();
        rjc1.createItemList((JSONArray) jsonReceipt.get("products"));
        float totalByProducts = rjc1.getXmlReceipt().getTotal().getTotalprice().getTotalnetvalue();

        REWEJSONComposer rjc2 = new REWEJSONComposer();
        rjc2.createTotal((JSONObject) jsonReceipt.get("basket"));
        float totalByTotal = rjc2.getXmlReceipt().getTotal().getTotalprice().getTotalnetvalue();

        assertEquals("The different ways to get Total sum should lead to the same result", totalByProducts, totalByTotal, 0.01f);
    }

    public void testPDFReceipt() throws Exception {
        File testFile = new File("./test/res/rewePDFReceipt.txt");
        InputStream is = new FileInputStream(testFile);

        REWEPDFComposer composer = new REWEPDFComposer();
        ObjectFactory.Xmlreceipt receipt = composer.getXmlReceipt(is);

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(ObjectFactory.Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(receipt, System.out);
    }


}