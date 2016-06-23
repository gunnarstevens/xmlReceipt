# xmlReceipt
Specification of the data format for digial, interactive sales slips that are more informative than the current paper based one 

## Introduction
A sales receipt documents the payment of a purchase (e.g. a grocery store) or service (e.g. catering).  A sales receipt is subject of fewer requirements than e.g. an invoice complaint to with § 14 UStG. For instance, a receipt usually does not include personalized information of the buyer (name and address) and an invoice. Up to a value of 150 euros of receipts is considered low value invoice (Kleinbetragsrechnung), if it confirms to the request of § 33 of the UStG implementing regulation (name, address, date and description of goods).

A user friendly receipt (“sprechender Kassenbon”) is a sales receipt on which the article descriptions in plain text are visible. In earlier times with simple cash registers of receipt contained only information on the group (z. B. alcohol) with the corresponding price. 

However, the lack of information has made it difficult for buyers for what exactly the money was spent. As a result, buyers needs in some cases an additional receipt with accurate mention of the product or service. Modern POS systems enable the details of the exact description of goods on the receipt. This is usually done by scanning the item ID or inputting a commodity code manually. The POS system use this item identifier to retrieve the needed information from the enterprise resource planning system.

The xmlReceipt (or it’s pet name eSlip) is the electronic equivalent to the paper based receipt. The electronic receipt enhances the concept of user friendly receipts by providing additional information e.g. including the best before or expiration date. In particular, the eSlip includes the identifier of each item (e.g. the GTIN or EAN) so that value services could use it to retrieve further information about the the goods purchased.  Among other things, the xmlReceipt enable added value services such as:
* Grouping purchased goods into item groups and provide aggregated information for each group.
* Give a warning in the case of food intolerances
* Perform a price comparison for the purchased goods
* Provide statistical information about regional or organic goods,
* Providing traffic light food labelling system aggregated about all purchases
* …

# Basic information and structure 
The xmlReceipt record presents essential information about a purchase, information consumer information systems must have to provide the outlined added value services.  The electronic receive should include following information:
- Name and address of business -  optional also the name of the seller
- Tax identification number (VAT ID)
- Date and Time
- Product description including item id, item name and item groups
- Price of goods (retail gross price, otherwise net value) - optional also amount of goods and goods related dates
- optional, also separate sales tax expulsion by VAT rate of 7% and 19% respectively
The following give an example of a xmlReceipt record for an ordinary supermarket shopping

```xml
<xmlreceipt>
  <seller>
    <sellername>Mytime</sellername>
    <sellerid>SELLER.MYTIME</sellerid>
    <selleraddress>http://www.mytime.de</selleraddress>
  </seller>
  <itemlist>
    <item>
      <productname>Original Wagner Big Pizza BBQ-Chicken</productname>
      <productid>
        <ean>4009233012084</ean>
      </productid>
      <price>
        <currency>EUR</currency>
        <brutto>2.99</brutto>
      </price>
      <quantity>
        <gramm>420</gramm>
      </quantity>
      <itemgroup>
        <category name="Lebensmittel">
          <category name="Fastfood und ganze Fertiggerichte">
            <category name="Pizza und Pizzabaguette"></category>
          </category>
        </category>
      </itemgroup>
      <dates>
        <bestbefore>2017-09-29T03:49:45</bestbefore>
      </dates>
      <info>
        <!--You may enter ANY elements at this point-->
      </info>
    </item>
  </itemlist>
</xmlreceipt>
```
# Specification

![xmlreceipt scheme](scheme.png "Basic structure of the xml scheme") 

*Figure 1 xmlReceipt XML scheme*

The xmlreceipt is an xml record that conforms to the XML scheme defined by the xmlreceipt.xsd file. The diagram above shows the general structure of XML scheme and every element that it can contain. Each element, along with all of its attributes, is documented in full below. 

## Root nodes 
The overall structure of a xmlReceipt is that first all seller information is given followed by the list of the purchased items. The root of a receipt recode is the xmlreceipt node. The node has two children: the seller node, which hold all information about the seller and the itemlist node, which holds all information about the purchased goods.

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| xmlreceipt | node    | The xmlreceipt is the top-level node that holds all purchase information         |
| seller     | node    | The seller node holds all information about the seller where the goods were buy. |
| itemlist   | node    | The itemlist node holds all information about the purchase goods. The child nodes represent a purchased item. Information that relates to the purchased items in total (like the total price of the purchase) are either stored as an attribute the itemlist or as in an direct child node of the itemlist. |

# Seller information
The seller node holds all information about the seller where the goods are brought. 
The main entry is the sellername, which is present the common human-readable name of the seller like LIDL, ALDI, REWE.
The seller also could provide a seller id as well as a seller url, which costumer value services could use to request additional information (like logo, ratings, etc.) and show it the costumer in an appropriate way  

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| sellername | Xs:string    | The human readable, common name of the seller         |
| sellerid   | Xs:string    | A unique identifier of the seller like the DUNS or CRI (see Appendix) |
| sellerurl   | xs:anyURI   | An url provided by the seller to request further information |
| selleraddress   | Xs:string    |  The address of the seller |

# Item information
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| itemname | Xs:string    | __TODO__         |
| itemid   | node    |  __TODO__ |
| dates   | node    |  __TODO__ |
| price   | node    |  __TODO__ |
| quantity   | node    |  __TODO__ |
| itemgroup   | node    |  __TODO__ |
| infosheet   | node    |  __TODO__ |
| aspect   | node    |  __TODO__ |


## Item identifier 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |


## Item dates 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |

## Item prices 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |

## Item quantities 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |

## Item group 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |


## Item sheet 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |


## Item sheet 
~~At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ~~

| Item       | Type    | Description                                                                      |
| -----------|---------|----------------------------------------------------------------------------------|
| __TODO__  | __TODO__     | __TODO__         |

#Referred Standards

##Country dependent information

| Name       | Referred code list    | Description                                    |
| -----------|--------------|--------------------------------------------------------------|
| Country    | ISO 3166-1   | __TODO__                                                     |
| Currency   | ISO 4217     | __TODO__                                                     |
| Language   | ISO 639      | __TODO__                                                     |

## Seller identifier information
| Name       | Referred code list    | Description                                         |
| -----------|--------------|--------------------------------------------------------------|
| DUNS       |  dnb.com/duns-number.html   | DUNS (Data Universal Numbering System) is a unique nine-digit numbering system that is used to identify a business|
| CRI       |  __TODO__   |  Customer Reference Identifier: Unique company registration identifier |

## Item identifier information
| Name       | Referred code list    | Description                                    |
| -----------|--------------|--------------------------------------------------------------|
| GTIN       |  __TODO__   | The GTIN (Global Trade Item Number) is the foundation for the EAN.UCC System for uniquely identifying trade item (products and services)|
| EAN       |  ean-int.org   |  Family of industry standards for the identification of items, trade and logistic units, services and locations. Among others, the family covers product identification, especially bar code specifications|
 
##Item category
| Code       | Reference    | Description                                                                               |
| ----------------------|--------------|--------------------------------------------------------------------------------|
| UNSPSC  | __TODO__   | __TODO__                                                                                       |
| CPV     | __TODO__   | __TODO__                                                                                       |
| eClass  | eclass.eu   | eCl@ss is a industry standard for the classification and description of products and services |

## Aspect
| Code             | International code list    | Description                                        |
| -----------------|------------------|--------------------------------------------------------------|
| Delivery terms   | UN/EDIFACT No 5  | __TODO__                                                     |
| Unit of Measure  | UN/ECE N°20      | __TODO__                                                     |




