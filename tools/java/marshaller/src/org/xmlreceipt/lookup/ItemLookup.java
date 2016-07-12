package org.xmlreceipt.lookup;

import org.xmlreceipt.marshaller.xmlreceipt.ObjectFactory;

import java.io.IOException;

/**
 * The class lookup for the information for an particular item and stores the retrieved information in the item object
 * Created by stevens on 01/07/16.
 */
public interface ItemLookup {

    /**
     * lookup the information given by the item name
     *
     * @param factory helper factory to create xml receipt nodes
     * @param item    the item, where the retrieved information should be stored
     * @param name    the name that should be used to retrieve the information
     * @return true, if the information was found, false otherwise
     * @throws IOException
     */
    boolean lookupByName(ObjectFactory factory, ObjectFactory.Xmlreceipt.Itemlist.Item item, String name) throws IOException;
}