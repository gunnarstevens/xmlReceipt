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
