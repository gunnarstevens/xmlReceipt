package org.xmlreceipt.marshaller;


import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Scanner;

/**
 * /**
 * Created by stevens on 26/06/16.
 */
public class REWEComposerTest {


    @org.junit.Test
    public void testReader() throws Exception {
        File testFile = new File("./test/res/samplePDFReceipt.txt");
        InputStream is = new FileInputStream(testFile);

        Scanner scanner = new Scanner(is);
        int i = 0;
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();

            if ("MwSt.".equals(line)) {
                line = scanner.nextLine();
                line = scanner.nextLine();
                scanItem(scanner, line);
            }

        }
        System.out.println("EOF");

    }

    private void scanItem(Scanner scanner, String line) {
        System.out.print("PRO: " + line);
        line = scanner.nextLine();
        line = scanner.nextLine();
        System.out.print("; ANZ: " + line);
        line = scanner.nextLine();
        line = scanner.nextLine();
        System.out.print("; PRE_E: " + line);
        line = scanner.nextLine();
        line = scanner.nextLine();
        System.out.print("; PRE_G: " + line);
        line = scanner.nextLine();
        line = scanner.nextLine();
        System.out.println("; TAX: " + line);

        line = scanner.nextLine();
        line = scanner.nextLine();
        if ("1".equals(line) == false && "Servicegebühr Lieferung".equals(line) == false) {
            scanItem(scanner, line);
        }

    }

    @org.junit.Test
    public void createItemlist() throws Exception {
 /*
        String[] testSell = {
                "Mango essreif",
                "Wagner Steinofen Pizza Mozzarella",
                "Wagner Steinofen Elsässer Flammkuchen",
                "Kraft Oreo Ice Cup",
                "Wagner Steinofen Pizza Thunfisch"
        };
        AbstractComposer reweComposer = new REWEComposer();

        for (String ean : testSell) {
            Xmlreceipt.Itemlist.Item item = reweComposer.addItem("ean", ean);
        }

        Xmlreceipt receipt = reweComposer.getXmlReceipt();

        // unmarshal a doc
        JAXBContext jc = JAXBContext.newInstance(Xmlreceipt.class);
        Marshaller m = jc.createMarshaller();
        m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
        m.marshal(receipt, System.out);
*/
    }
}