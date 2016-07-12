package org.xmlreceipt.marshaller;


import org.apache.pdfbox.cos.COSDocument;
import org.apache.pdfbox.io.RandomAccessBuffer;
import org.apache.pdfbox.pdfparser.PDFParser;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.xmlreceipt.composer.lidl.LIDLComposer;
import org.xmlreceipt.marshaller.xmlreceipt.ObjectFactory;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.File;
import java.io.FileInputStream;
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
    public void getTestReceipt1() throws Exception {
        File testFile = new File("./test/res/Rechnung.pdf");
        FileInputStream pdfReceipt;
        pdfReceipt = new FileInputStream(testFile);

        PDFTextStripper pdfStripper = null;
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
    }

    @org.junit.Test
    public void createItemlist() throws Exception {
        String[] testSell = {
                "20067397",
                "20000653",
                "20003548",
                "20235130"
        };
        LIDLComposer lidlReceipt = new LIDLComposer();

        for (String ean : testSell) {
            ObjectFactory.Xmlreceipt.Itemlist.Item item = lidlReceipt.addItem("gtin", ean);
        }

        ObjectFactory.Xmlreceipt receipt = lidlReceipt.getXmlReceipt();

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(ObjectFactory.Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(receipt, System.out);


    }

    @org.junit.Test
    public void createSeller() throws Exception {
        LIDLComposer lidlReceipt = new LIDLComposer();
        ObjectFactory.Xmlreceipt.Seller seller = lidlReceipt.createSeller();

        assertEquals("seller name", LIDLComposer.SELLERNAME, seller.getSellername());
        assertEquals("seller id", LIDLComposer.DUNS, seller.getSellerid().getDuns());
        assertEquals("seller vatin", LIDLComposer.VATIN, seller.getVatin());
        assertEquals("seller uri", LIDLComposer.URI, seller.getUri());
        assertEquals("seller address", LIDLComposer.ADDRESS, seller.getSelleraddress());

    }


    @org.junit.Test
    public void createItem() throws Exception {
        LIDLComposer lidlReceipt = new LIDLComposer();
        ObjectFactory.Xmlreceipt.Itemlist.Item item = lidlReceipt.createItem("ean", MILK_EAN);

        assertEquals("item name", MILK_NAME, item.getItemname());
        assertEquals("ean item id", new BigInteger(MILK_EAN), item.getItemid().getEan());
        assertEquals("price currency", MILK_CURRENCY, item.getPrice().getCurrency());
        assertEquals("price value", MILK_PRICE, item.getPrice().getItemvalue(), 0.0f);
        assertEquals("quantity gramm", MILK_LITRE, item.getQuantity().getLitre(), 0.0f);
    }


}