package org.xmlreceipt.marshaller;


import org.xmlreceipt.composer.REWEComposer;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Marshaller;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

/**
 * /**
 * Created by stevens on 26/06/16.
 */
public class REWEComposerTest {


    @org.junit.Test
    public void testReader() throws Exception {
        File testFile = new File("./test/res/samplePDFReceipt.txt");
        InputStream is = new FileInputStream(testFile);

        REWEComposer composer = new REWEComposer();
        Xmlreceipt receipt = composer.convertPDFReceipt(is);

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(receipt, System.out);
    }
}